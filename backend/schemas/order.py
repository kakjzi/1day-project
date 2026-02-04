from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class OrderItemResponse(BaseModel):
    id: int
    menu_id: int
    menu_name: str
    quantity: int
    unit_price: int
    subtotal: int


class OrderResponse(BaseModel):
    id: int
    display_number: str
    table_id: int
    status: str
    total_amount: int
    created_at: Optional[datetime] = None
    items: List[OrderItemResponse] = []


class OrderStatusUpdate(BaseModel):
    status: str
