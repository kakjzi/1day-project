from pydantic import BaseModel
from typing import Optional, List


class OptionBase(BaseModel):
    name: str
    price: int = 0


class OptionCreate(OptionBase):
    pass


class OptionResponse(OptionBase):
    id: int
    
    class Config:
        from_attributes = True


class OptionGroupBase(BaseModel):
    name: str
    is_required: bool = False
    max_select: int = 1


class OptionGroupCreate(OptionGroupBase):
    options: List[OptionCreate] = []


class OptionGroupResponse(OptionGroupBase):
    id: int
    options: List[OptionResponse] = []
    
    class Config:
        from_attributes = True


class MenuBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: int
    image_url: Optional[str] = None
    sort_order: int = 0
    is_sold_out: bool = False


class MenuCreate(BaseModel):
    category_id: int
    name: str
    description: Optional[str] = None
    price: int
    image_url: Optional[str] = None
    sort_order: int = 0


class MenuUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_sold_out: Optional[bool] = None
    category_id: Optional[int] = None


class MenuResponse(MenuBase):
    id: int
    category_id: int
    
    class Config:
        from_attributes = True


class MenuDetailResponse(MenuResponse):
    option_groups: List[OptionGroupResponse] = []


class CategoryBase(BaseModel):
    name: str
    sort_order: int = 0


class CategoryCreate(BaseModel):
    store_id: int
    name: str
    sort_order: int = 0


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    sort_order: Optional[int] = None


class CategoryResponse(CategoryBase):
    id: int
    store_id: int
    
    class Config:
        from_attributes = True
