from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class OptionGroup(Base):
    """옵션 그룹 모델"""
    __tablename__ = "option_groups"
    
    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey("menus.id"), nullable=False)
    name = Column(String(50), nullable=False)
    is_required = Column(Boolean, default=False)
    max_select = Column(Integer, default=1)
    
    # Relationships
    menu = relationship("Menu", back_populates="option_groups")
    options = relationship("Option", back_populates="option_group")


class Option(Base):
    """옵션 모델"""
    __tablename__ = "options"
    
    id = Column(Integer, primary_key=True, index=True)
    option_group_id = Column(Integer, ForeignKey("option_groups.id"), nullable=False)
    name = Column(String(50), nullable=False)
    price = Column(Integer, default=0)
    
    # Relationships
    option_group = relationship("OptionGroup", back_populates="options")
