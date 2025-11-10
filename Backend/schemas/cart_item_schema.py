from pydantic import BaseModel


class CartItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float


class CartItemCreate(CartItemBase):
    pass


class CartItem(CartItemBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
