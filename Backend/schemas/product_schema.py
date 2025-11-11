from pydantic import BaseModel, validator


class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image: str | None = None


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    id: int
    category: str

    class Config:
        from_attributes = True

    @validator('category', pre=True)
    def category_to_string(cls, v):
        if hasattr(v, 'name'):
            return v.name
        return v
