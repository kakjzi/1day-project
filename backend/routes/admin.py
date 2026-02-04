from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from database import get_db
from models.menu import Menu
from models.category import Category
from models.option import OptionGroup, Option
from models.admin import Admin
from schemas.menu import (
    MenuCreate, MenuUpdate, MenuResponse,
    CategoryCreate, CategoryUpdate, CategoryResponse,
    OptionGroupCreate, OptionGroupResponse
)
from routes.auth import get_current_admin, get_current_admin_from_query

router = APIRouter()


# ============ Menu Management ============

@router.post("/menus", status_code=status.HTTP_201_CREATED)
def create_menu(
    request: MenuCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """메뉴 등록"""
    menu = Menu(
        category_id=request.category_id,
        name=request.name,
        description=request.description,
        price=request.price,
        image_url=request.image_url,
        sort_order=request.sort_order
    )
    db.add(menu)
    db.commit()
    db.refresh(menu)
    
    return {
        "id": menu.id,
        "category_id": menu.category_id,
        "name": menu.name,
        "description": menu.description,
        "price": menu.price,
        "image_url": menu.image_url,
        "sort_order": menu.sort_order,
        "is_sold_out": menu.is_sold_out
    }


@router.put("/menus/{menu_id}")
def update_menu(
    menu_id: int,
    request: MenuUpdate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """메뉴 수정"""
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    
    if not menu:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"code": "MENU_001", "message": "Menu not found"}
        )
    
    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(menu, key, value)
    
    db.commit()
    db.refresh(menu)
    
    return {
        "id": menu.id,
        "category_id": menu.category_id,
        "name": menu.name,
        "description": menu.description,
        "price": menu.price,
        "image_url": menu.image_url,
        "sort_order": menu.sort_order,
        "is_sold_out": menu.is_sold_out
    }


@router.delete("/menus/{menu_id}")
def delete_menu(
    menu_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """메뉴 삭제"""
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    
    if not menu:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"code": "MENU_001", "message": "Menu not found"}
        )
    
    db.delete(menu)
    db.commit()
    
    return {"success": True}


# ============ Category Management ============

@router.post("/categories", status_code=status.HTTP_201_CREATED)
def create_category(
    request: CategoryCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """카테고리 등록"""
    category = Category(
        store_id=request.store_id,
        name=request.name,
        sort_order=request.sort_order
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    
    return {
        "id": category.id,
        "store_id": category.store_id,
        "name": category.name,
        "sort_order": category.sort_order
    }


@router.put("/categories/{category_id}")
def update_category(
    category_id: int,
    request: CategoryUpdate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """카테고리 수정"""
    category = db.query(Category).filter(Category.id == category_id).first()
    
    if not category:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"code": "MENU_001", "message": "Category not found"}
        )
    
    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)
    
    db.commit()
    db.refresh(category)
    
    return {
        "id": category.id,
        "store_id": category.store_id,
        "name": category.name,
        "sort_order": category.sort_order
    }


@router.delete("/categories/{category_id}")
def delete_category(
    category_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """카테고리 삭제"""
    category = db.query(Category).filter(Category.id == category_id).first()
    
    if not category:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"code": "MENU_001", "message": "Category not found"}
        )
    
    # 메뉴가 있는지 확인
    menu_count = db.query(Menu).filter(Menu.category_id == category_id).count()
    if menu_count > 0:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"code": "MENU_003", "message": "Category has menus, cannot delete"}
        )
    
    db.delete(category)
    db.commit()
    
    return {"success": True}


# ============ Option Group Management ============

@router.post("/menus/{menu_id}/options", status_code=status.HTTP_201_CREATED)
def create_option_group(
    menu_id: int,
    request: OptionGroupCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """옵션 그룹 등록"""
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not menu:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"code": "MENU_001", "message": "Menu not found"}
        )
    
    option_group = OptionGroup(
        menu_id=menu_id,
        name=request.name,
        is_required=request.is_required,
        max_select=request.max_select
    )
    db.add(option_group)
    db.commit()
    db.refresh(option_group)
    
    # 옵션들 추가
    options_response = []
    for opt in request.options:
        option = Option(
            option_group_id=option_group.id,
            name=opt.name,
            price=opt.price
        )
        db.add(option)
        db.commit()
        db.refresh(option)
        options_response.append({
            "id": option.id,
            "name": option.name,
            "price": option.price
        })
    
    return {
        "id": option_group.id,
        "name": option_group.name,
        "is_required": option_group.is_required,
        "max_select": option_group.max_select,
        "options": options_response
    }


@router.delete("/options/{option_group_id}")
def delete_option_group(
    option_group_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """옵션 그룹 삭제"""
    option_group = db.query(OptionGroup).filter(OptionGroup.id == option_group_id).first()
    
    if not option_group:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"code": "MENU_001", "message": "Option group not found"}
        )
    
    # 옵션들도 함께 삭제
    db.query(Option).filter(Option.option_group_id == option_group_id).delete()
    db.delete(option_group)
    db.commit()
    
    return {"success": True}


# ============ Order Management ============

from models.order import Order, OrderItem
from schemas.order import OrderStatusUpdate

# 유효한 상태 전이
VALID_TRANSITIONS = {
    "PENDING": ["ACCEPTED"],
    "ACCEPTED": ["PREPARING"],
    "PREPARING": ["COMPLETED"],
    "COMPLETED": []
}


@router.get("/orders")
def get_all_orders(
    store_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """모든 활성 주문 조회"""
    orders = db.query(Order).filter(
        Order.store_id == store_id,
        Order.status != "COMPLETED"
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


@router.patch("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    request: OrderStatusUpdate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """주문 상태 변경"""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"code": "ORDER_001", "message": "Order not found"}
        )
    
    # 상태 전이 검증
    valid_next = VALID_TRANSITIONS.get(order.status, [])
    if request.status not in valid_next:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"code": "ORDER_003", "message": f"Invalid status transition from {order.status} to {request.status}"}
        )
    
    order.status = request.status
    db.commit()
    db.refresh(order)
    
    return {
        "id": order.id,
        "display_number": order.display_number,
        "status": order.status,
        "total_amount": order.total_amount
    }


@router.delete("/orders/{order_id}")
def delete_order(
    order_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """주문 삭제"""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"code": "ORDER_001", "message": "Order not found"}
        )
    
    # 완료된 주문은 삭제 불가
    if order.status == "COMPLETED":
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"code": "ORDER_002", "message": "Cannot delete completed order"}
        )
    
    # 주문 항목 삭제
    db.query(OrderItem).filter(OrderItem.order_id == order_id).delete()
    db.delete(order)
    db.commit()
    
    return {"success": True}


# ============ Table Management ============

from models.table import Table
from models.order import OrderHistory
from models.cart import Cart
import json
import uuid as uuid_module
from datetime import datetime, timezone


class TableCreate(BaseModel):
    store_id: int
    table_number: int
    pin: str


class TableTransfer(BaseModel):
    target_table_id: int


@router.get("/tables")
def get_tables(
    store_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """테이블 목록 조회"""
    tables = db.query(Table).filter(Table.store_id == store_id).all()
    
    result = []
    for table in tables:
        # 현재 세션 주문 총액 계산
        total_amount = 0
        if table.session_id:
            orders = db.query(Order).filter(
                Order.table_id == table.id,
                Order.session_id == table.session_id
            ).all()
            total_amount = sum(o.total_amount for o in orders)
        
        result.append({
            "id": table.id,
            "table_number": table.table_number,
            "pin": table.pin,
            "session_id": table.session_id,
            "session_started_at": table.session_started_at.isoformat() if table.session_started_at else None,
            "total_amount": total_amount
        })
    
    return result


@router.post("/tables", status_code=status.HTTP_201_CREATED)
def create_table(
    request: TableCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """테이블 생성"""
    table = Table(
        store_id=request.store_id,
        table_number=request.table_number,
        pin=request.pin
    )
    db.add(table)
    db.commit()
    db.refresh(table)
    
    return {
        "id": table.id,
        "store_id": table.store_id,
        "table_number": table.table_number,
        "pin": table.pin
    }


@router.post("/tables/{table_id}/complete")
def complete_table_session(
    table_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """테이블 이용 완료"""
    table = db.query(Table).filter(Table.id == table_id).first()
    
    if not table:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"code": "TABLE_001", "message": "Table not found"}
        )
    
    if not table.session_id:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"code": "TABLE_002", "message": "No active session"}
        )
    
    # 현재 세션의 주문들을 이력으로 복사
    orders = db.query(Order).filter(
        Order.table_id == table_id,
        Order.session_id == table.session_id
    ).all()
    
    for order in orders:
        items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        order_data = {
            "display_number": order.display_number,
            "status": order.status,
            "items": [
                {
                    "menu_name": item.menu_name,
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                    "subtotal": item.subtotal
                }
                for item in items
            ]
        }
        
        history = OrderHistory(
            original_order_id=order.id,
            store_id=order.store_id,
            table_id=table_id,
            table_number=table.table_number,
            session_id=table.session_id,
            display_number=order.display_number,
            order_data=json.dumps(order_data),
            total_amount=order.total_amount
        )
        db.add(history)
    
    # 장바구니 삭제
    db.query(Cart).filter(Cart.table_id == table_id).delete()
    
    # 세션 리셋
    table.session_id = None
    table.session_started_at = None
    
    db.commit()
    
    return {"success": True}


@router.post("/tables/{table_id}/transfer")
def transfer_orders(
    table_id: int,
    request: TableTransfer,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """주문 이동"""
    source_table = db.query(Table).filter(Table.id == table_id).first()
    target_table = db.query(Table).filter(Table.id == request.target_table_id).first()
    
    if not source_table:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"code": "TABLE_001", "message": "Source table not found"}
        )
    
    if not target_table:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"code": "TABLE_001", "message": "Target table not found"}
        )
    
    # 대상 테이블에 세션이 없으면 새로 시작
    if not target_table.session_id:
        target_table.session_id = str(uuid_module.uuid4())
        target_table.session_started_at = datetime.now(timezone.utc)
    
    # 주문 이동
    orders = db.query(Order).filter(
        Order.table_id == table_id,
        Order.session_id == source_table.session_id
    ).all()
    
    for order in orders:
        order.table_id = target_table.id
        order.session_id = target_table.session_id
    
    # 장바구니 이동
    carts = db.query(Cart).filter(Cart.table_id == table_id).all()
    for cart in carts:
        cart.table_id = target_table.id
    
    # 원본 테이블 세션 리셋
    source_table.session_id = None
    source_table.session_started_at = None
    
    db.commit()
    
    return {"success": True}


@router.get("/tables/{table_id}/history")
def get_order_history(
    table_id: int,
    date: str = None,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """과거 주문 조회"""
    query = db.query(OrderHistory).filter(OrderHistory.table_id == table_id)
    
    if date:
        from datetime import datetime as dt
        target_date = dt.strptime(date, "%Y-%m-%d").date()
        query = query.filter(
            db.func.date(OrderHistory.completed_at) == target_date
        )
    
    histories = query.order_by(OrderHistory.completed_at.desc()).all()
    
    return [
        {
            "id": h.id,
            "display_number": h.display_number,
            "total_amount": h.total_amount,
            "completed_at": h.completed_at.isoformat() if h.completed_at else None,
            "order_data": json.loads(h.order_data) if h.order_data else {}
        }
        for h in histories
    ]


# ============ SSE Stream ============

from fastapi.responses import StreamingResponse
from utils.sse import event_manager, format_sse_event
import asyncio


async def order_event_generator(store_id: int, queue: asyncio.Queue):
    """주문 이벤트 생성기"""
    try:
        # 연결 확인 이벤트
        yield format_sse_event("connected", {"store_id": store_id})
        
        while True:
            try:
                # 30초 타임아웃으로 이벤트 대기
                message = await asyncio.wait_for(queue.get(), timeout=30.0)
                yield message
            except asyncio.TimeoutError:
                # 타임아웃 시 heartbeat 전송
                yield format_sse_event("heartbeat", {"status": "alive"})
    except asyncio.CancelledError:
        pass
    finally:
        event_manager.unsubscribe(store_id, queue)


@router.get("/orders/stream")
async def order_stream(
    store_id: int,
    token: str,
    admin: Admin = Depends(get_current_admin_from_query)
):
    """실시간 주문 스트림 (SSE)"""
    queue = event_manager.subscribe(store_id)
    
    return StreamingResponse(
        order_event_generator(store_id, queue),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
