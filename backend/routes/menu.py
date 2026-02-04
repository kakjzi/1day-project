from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List

from database import get_db
from models.menu import Menu
from models.category import Category
from models.option import OptionGroup, Option
from schemas.menu import (
    MenuCreate, MenuUpdate, MenuResponse, MenuDetailResponse,
    CategoryCreate, CategoryUpdate, CategoryResponse,
    OptionGroupCreate, OptionGroupResponse
)

router = APIRouter()


@router.get("/menus", response_model=List[MenuResponse])
def get_menus(
    store_id: int = Query(...),
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """메뉴 목록 조회"""
    query = db.query(Menu).join(Category).filter(Category.store_id == store_id)
    
    if category_id:
        query = query.filter(Menu.category_id == category_id)
    
    menus = query.order_by(Menu.sort_order).all()
    return menus


@router.get("/menus/{menu_id}")
def get_menu(menu_id: int, db: Session = Depends(get_db)):
    """메뉴 상세 조회"""
    menu = db.query(Menu).options(
        joinedload(Menu.option_groups).joinedload(OptionGroup.options)
    ).filter(Menu.id == menu_id).first()
    
    if not menu:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"code": "MENU_001", "message": "Menu not found"}
        )
    
    return {
        "id": menu.id,
        "category_id": menu.category_id,
        "name": menu.name,
        "description": menu.description,
        "price": menu.price,
        "image_url": menu.image_url,
        "sort_order": menu.sort_order,
        "is_sold_out": menu.is_sold_out,
        "option_groups": [
            {
                "id": og.id,
                "name": og.name,
                "is_required": og.is_required,
                "max_select": og.max_select,
                "options": [
                    {"id": o.id, "name": o.name, "price": o.price}
                    for o in og.options
                ]
            }
            for og in menu.option_groups
        ]
    }


@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(
    store_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """카테고리 목록 조회"""
    categories = db.query(Category).filter(
        Category.store_id == store_id
    ).order_by(Category.sort_order).all()
    return categories
