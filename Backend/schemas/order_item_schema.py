from pydantic import BaseModel


class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float


class OrderItemCreate(OrderItemBase):
    order_id: int


class OrderItem(OrderItemBase):
    id: int

    class Config:
        from_attributes = True
