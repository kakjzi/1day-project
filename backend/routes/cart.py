from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
import json

from database import get_db
from models.cart import Cart
from models.menu import Menu
from models.table import Table
from schemas.cart import CartCreate, CartUpdate
from utils.security import decode_token

router = APIRouter()
security = HTTPBearer(auto_error=False)


def get_current_table(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Table:
    """현재 인증된 테이블 가져오기"""
    if credentials is None:
        raise Exception("Token required")
    
    token = credentials.credentials
    
    # Mock token for testing (임시)
    if token.startswith('mock-token-table-'):
        table_number = int(token.split('-')[-1])
        table = db.query(Table).filter(Table.table_number == table_number, Table.store_id == 1).first()
        if table:
            return table
        else:
            raise Exception("Invalid mock token")
    
    payload = decode_token(token)
    if payload is None:
        raise Exception("Invalid token")
    
    table_id = payload.get("table_id")
    if table_id is None:
        raise Exception("Invalid token payload")
    
    table = db.query(Table).filter(Table.id == table_id).first()
    if table is None:
        raise Exception("Table not found")
    
    return table


@router.post("/cart", status_code=status.HTTP_201_CREATED)
def add_to_cart(
    request: CartCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """장바구니에 메뉴 추가"""
    if credentials is None:
        return JSONResponse(status_code=401, content={"code": "AUTH_002", "message": "Token required"})
    
    payload = decode_token(credentials.credentials)
    if payload is None:
        return JSONResponse(status_code=401, content={"code": "AUTH_002", "message": "Invalid token"})
    
    table_id = payload.get("table_id")
    
    # 메뉴 확인
    menu = db.query(Menu).filter(Menu.id == request.menu_id).first()
    if not menu:
        return JSONResponse(status_code=404, content={"code": "MENU_001", "message": "Menu not found"})
    
    # 품절 확인
    if menu.is_sold_out:
        return JSONResponse(status_code=400, content={"code": "MENU_002", "message": "Menu is sold out"})
    
    cart = Cart(
        table_id=table_id,
        menu_id=request.menu_id,
        quantity=request.quantity,
        options=json.dumps([opt.model_dump() for opt in request.options])
    )
    db.add(cart)
    db.commit()
    db.refresh(cart)
    
    return {
        "id": cart.id,
        "table_id": cart.table_id,
        "menu_id": cart.menu_id,
        "quantity": cart.quantity
    }


@router.get("/cart")
def get_cart(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """장바구니 목록 조회"""
    if credentials is None:
        return JSONResponse(status_code=401, content={"code": "AUTH_002", "message": "Token required"})
    
    payload = decode_token(credentials.credentials)
    if payload is None:
        return JSONResponse(status_code=401, content={"code": "AUTH_002", "message": "Invalid token"})
    
    table_id = payload.get("table_id")
    
    carts = db.query(Cart).filter(Cart.table_id == table_id).all()
    
    result = []
    for cart in carts:
        menu = db.query(Menu).filter(Menu.id == cart.menu_id).first()
        options = json.loads(cart.options) if cart.options else []
        options_total = sum(opt.get("price", 0) for opt in options)
        
        result.append({
            "id": cart.id,
            "table_id": cart.table_id,
            "menu_id": cart.menu_id,
            "menu_name": menu.name if menu else "",
            "menu_price": menu.price if menu else 0,
            "quantity": cart.quantity,
            "options": options,
            "subtotal": (menu.price + options_total) * cart.quantity if menu else 0
        })
    
    return result


@router.put("/cart/{cart_id}")
def update_cart(
    cart_id: int,
    request: CartUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """장바구니 항목 수정"""
    if credentials is None:
        return JSONResponse(status_code=401, content={"code": "AUTH_002", "message": "Token required"})
    
    payload = decode_token(credentials.credentials)
    if payload is None:
        return JSONResponse(status_code=401, content={"code": "AUTH_002", "message": "Invalid token"})
    
    table_id = payload.get("table_id")
    
    cart = db.query(Cart).filter(Cart.id == cart_id, Cart.table_id == table_id).first()
    if not cart:
        return JSONResponse(status_code=404, content={"code": "CART_001", "message": "Cart item not found"})
    
    if request.quantity is not None:
        cart.quantity = request.quantity
    if request.options is not None:
        cart.options = json.dumps([opt.model_dump() for opt in request.options])
    
    db.commit()
    db.refresh(cart)
    
    return {
        "id": cart.id,
        "table_id": cart.table_id,
        "menu_id": cart.menu_id,
        "quantity": cart.quantity
    }


@router.delete("/cart/{cart_id}")
def delete_cart_item(
    cart_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """장바구니 항목 삭제"""
    if credentials is None:
        return JSONResponse(status_code=401, content={"code": "AUTH_002", "message": "Token required"})
    
    payload = decode_token(credentials.credentials)
    if payload is None:
        return JSONResponse(status_code=401, content={"code": "AUTH_002", "message": "Invalid token"})
    
    table_id = payload.get("table_id")
    
    cart = db.query(Cart).filter(Cart.id == cart_id, Cart.table_id == table_id).first()
    if not cart:
        return JSONResponse(status_code=404, content={"code": "CART_001", "message": "Cart item not found"})
    
    db.delete(cart)
    db.commit()
    
    return {"success": True}


@router.delete("/cart")
def clear_cart(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """장바구니 비우기"""
    if credentials is None:
        return JSONResponse(status_code=401, content={"code": "AUTH_002", "message": "Token required"})
    
    payload = decode_token(credentials.credentials)
    if payload is None:
        return JSONResponse(status_code=401, content={"code": "AUTH_002", "message": "Invalid token"})
    
    table_id = payload.get("table_id")
    
    db.query(Cart).filter(Cart.table_id == table_id).delete()
    db.commit()
    
    return {"success": True}
