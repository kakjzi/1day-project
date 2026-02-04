from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Category(Base):
    """카테고리 모델"""
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    name = Column(String(50), nullable=False)
    sort_order = Column(Integer, default=0)
    
    # Relationships
    store = relationship("Store", back_populates="categories")
    menus = relationship("Menu", back_populates="category")
