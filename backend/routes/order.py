from fastapi import APIRouter, Depends, status, Query
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
import uuid
import json

from database import get_db
from models.order import Order, OrderItem
from models.cart import Cart
from models.menu import Menu
from models.table import Table
from utils.security import decode_token

router = APIRouter()
security = HTTPBearer(auto_error=False)

# 유효한 상태 전이
VALID_TRANSITIONS = {
    "PENDING": ["ACCEPTED"],
    "ACCEPTED": ["PREPARING"],
    "PREPARING": ["COMPLETED"],
    "COMPLETED": []
}


def generate_display_number(table: Table, db: Session) -> str:
    """주문 표시 번호 생성 (테이블번호-당일순번)"""
    today = date.today()
    
    if table.last_order_date != today:
        table.daily_order_count = 0
        table.last_order_date = today
    
    table.daily_order_count += 1
    db.commit()
    
    return f"{table.table_number}-{table.daily_order_count}"


@router.post("/orders", status_code=status.HTTP_201_CREATED)
def create_order(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """주문 생성 (장바구니 → 주문)"""
    if credentials is None:
        return JSONResponse(status_code=401, content={"code": "AUTH_002", "message": "Token required"})
    
    payload = decode_token(credentials.credentials)
    if payload is None:
        return JSONResponse(status_code=401, content={"code": "AUTH_002", "message": "Invalid token"})
    
    table_id = payload.get("table_id")
    store_id = payload.get("store_id")
    
    table = db.query(Table).filter(Table.id == table_id).first()
    if not table:
        return JSONResponse(status_code=404, content={"code": "TABLE_001", "message": "Table not found"})
    
    # 장바구니 조회
    carts = db.query(Cart).filter(Cart.table_id == table_id).all()
    if not carts:
        return JSONResponse(status_code=400, content={"code": "ORDER_003", "message": "Cart is empty"})
    
    # 세션 시작 (없으면)
    if not table.session_id:
        table.session_id = str(uuid.uuid4())
        from datetime import datetime, timezone
        table.session_started_at = datetime.now(timezone.utc)
        db.commit()
    
    # 주문 번호 생성
    display_number = generate_display_number(table, db)
    
    # 총 금액 계산
    total_amount = 0
    order_items_data = []
    
    for cart in carts:
        menu = db.query(Menu).filter(Menu.id == cart.menu_id).first()
        if not menu:
            continue
        
        options = json.loads(cart.options) if cart.options else []
        options_total = sum(opt.get("price", 0) for opt in options)
        unit_price = menu.price + options_total
        subtotal = unit_price * cart.quantity
        total_amount += subtotal
        
        order_items_data.append({
            "menu_id": menu.id,
            "menu_name": menu.name,
            "quantity": cart.quantity,
            "unit_price": unit_price,
            "subtotal": subtotal,
            "options": options
        })
    
    # 주문 생성
    order = Order(
        display_number=display_number,
        store_id=store_id,
        table_id=table_id,
        session_id=table.session_id,
        status="PENDING",
        total_amount=total_amount
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # 주문 항목 생성
    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            menu_id=item_data["menu_id"],
            menu_name=item_data["menu_name"],
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            subtotal=item_data["subtotal"]
        )
        db.add(order_item)
    
    # 장바구니 비우기
    db.query(Cart).filter(Cart.table_id == table_id).delete()
    db.commit()
    
    return {
        "id": order.id,
        "display_number": order.display_number,
        "table_id": order.table_id,
        "status": order.status,
        "total_amount": order.total_amount,
        "items": order_items_data
    }


@router.get("/orders")
def get_orders(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """현재 테이블 세션의 주문 목록 조회"""
    if credentials is None:
        return JSONResponse(status_code=401, content={"code": "AUTH_002", "message": "Token required"})
    
    payload = decode_token(credentials.credentials)
    if payload is None:
        return JSONResponse(status_code=401, content={"code": "AUTH_002", "message": "Invalid token"})
    
    table_id = payload.get("table_id")
    
    table = db.query(Table).filter(Table.id == table_id).first()
    if not table or not table.session_id:
        return []
    
    orders = db.query(Order).filter(
        Order.table_id == table_id,
        Order.session_id == table.session_id
    ).order_by(Order.created_at.desc()).all()
    
    result = []
    for order in orders:
        items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        result.append({
            "id": order.id,
            "display_number": order.display_number,
            "table_id": order.table_id,
            "status": order.status,
            "total_amount": order.total_amount,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "items": [
                {
                    "id": item.id,
                    "menu_id": item.menu_id,
                    "menu_name": item.menu_name,
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                    "subtotal": item.subtotal
                }
                for item in items
            ]
        })
    
    return result
