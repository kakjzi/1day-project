from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Store(Base):
    """매장 모델"""
    __tablename__ = "stores"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    admins = relationship("Admin", back_populates="store")
    tables = relationship("Table", back_populates="store")
    categories = relationship("Category", back_populates="store")
    orders = relationship("Order", back_populates="store")
