from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Cart(Base):
    """장바구니 모델"""
    __tablename__ = "carts"
    
    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("tables.id"), nullable=False)
    menu_id = Column(Integer, ForeignKey("menus.id"), nullable=False)
    quantity = Column(Integer, default=1)
    options = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    table = relationship("Table", back_populates="carts")
    menu = relationship("Menu", back_populates="carts")
