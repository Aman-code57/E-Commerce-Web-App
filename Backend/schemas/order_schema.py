from pydantic import BaseModel
from typing import List
from datetime import datetime


class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float


class OrderItem(OrderItemBase):
    id: int

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    total_amount: float
    status: str = "pending"


class OrderCreate(OrderBase):
    items: List[OrderItemBase]


class Order(OrderBase):
    id: int
    user_id: int
    created_at: datetime
    items: List[OrderItem]

    class Config:
        from_attributes = True
