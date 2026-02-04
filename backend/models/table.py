from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Table(Base):
    """테이블 모델"""
    __tablename__ = "tables"
    
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    table_number = Column(Integer, nullable=False)
    pin = Column(String(4), nullable=False)
    session_id = Column(String(36), nullable=True)
    session_started_at = Column(DateTime, nullable=True)
    daily_order_count = Column(Integer, default=0)
    last_order_date = Column(Date, nullable=True)
    
    # Relationships
    store = relationship("Store", back_populates="tables")
    orders = relationship("Order", back_populates="table")
    carts = relationship("Cart", back_populates="table")
