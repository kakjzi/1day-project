from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Menu(Base):
    """메뉴 모델"""
    __tablename__ = "menus"
    
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Integer, nullable=False)
    image_url = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0)
    is_sold_out = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    category = relationship("Category", back_populates="menus")
    option_groups = relationship("OptionGroup", back_populates="menu")
    carts = relationship("Cart", back_populates="menu")
