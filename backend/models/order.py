from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Order(Base):
    """주문 모델"""
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    display_number = Column(String(10), nullable=False)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    table_id = Column(Integer, ForeignKey("tables.id"), nullable=False)
    session_id = Column(String(36), nullable=False)
    status = Column(String(20), default="PENDING")  # PENDING, ACCEPTED, PREPARING, COMPLETED
    total_amount = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    store = relationship("Store", back_populates="orders")
    table = relationship("Table", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    """주문 항목 모델"""
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    menu_id = Column(Integer, ForeignKey("menus.id"), nullable=False)
    menu_name = Column(String(100), nullable=False)  # 스냅샷
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Integer, nullable=False)
    subtotal = Column(Integer, nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="items")
    options = relationship("OrderItemOption", back_populates="order_item")


class OrderItemOption(Base):
    """주문 항목 옵션 모델"""
    __tablename__ = "order_item_options"
    
    id = Column(Integer, primary_key=True, index=True)
    order_item_id = Column(Integer, ForeignKey("order_items.id"), nullable=False)
    option_id = Column(Integer, ForeignKey("options.id"), nullable=False)
    option_name = Column(String(50), nullable=False)  # 스냅샷
    price = Column(Integer, nullable=False)  # 스냅샷
    
    # Relationships
    order_item = relationship("OrderItem", back_populates="options")


class OrderHistory(Base):
    """주문 이력 모델 (이용 완료된 주문)"""
    __tablename__ = "order_history"
    
    id = Column(Integer, primary_key=True, index=True)
    original_order_id = Column(Integer, nullable=False)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    table_id = Column(Integer, ForeignKey("tables.id"), nullable=False)
    table_number = Column(Integer, nullable=False)  # 스냅샷
    session_id = Column(String(36), nullable=False)
    display_number = Column(String(10), nullable=False)
    order_data = Column(Text, nullable=False)  # JSON
    total_amount = Column(Integer, nullable=False)
    completed_at = Column(DateTime, server_default=func.now())
