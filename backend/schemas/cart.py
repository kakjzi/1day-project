from pydantic import BaseModel
from typing import List, Optional


class CartOptionItem(BaseModel):
    option_id: int
    name: str
    price: int


class CartCreate(BaseModel):
    menu_id: int
    quantity: int = 1
    options: List[CartOptionItem] = []


class CartUpdate(BaseModel):
    quantity: Optional[int] = None
    options: Optional[List[CartOptionItem]] = None


class CartResponse(BaseModel):
    id: int
    table_id: int
    menu_id: int
    menu_name: str
    menu_price: int
    quantity: int
    options: List[CartOptionItem]
    subtotal: int
    
    class Config:
        from_attributes = True
