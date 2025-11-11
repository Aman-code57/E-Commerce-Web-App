from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from crud.product_crud import get_products, get_product, create_product, update_product, delete_product
from schemas.product_schema import Product, ProductCreate
from core.security import verify_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from crud.user_crud import get_user_by_email

router = APIRouter()
oauth2_scheme = HTTPBearer()

def get_current_user(token: HTTPAuthorizationCredentials = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token.credentials)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user_by_email(db, email=payload.get("sub"))
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/products", response_model=list[Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = get_products(db, skip=skip, limit=limit)
    return products


@router.get("/products/{product_id}", response_model=Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


@router.post("/products", response_model=Product)
def create_product_endpoint(product: ProductCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return create_product(db, product)


@router.put("/products/{product_id}", response_model=Product)
def update_product_endpoint(product_id: int, product: ProductCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    db_product = update_product(db, product_id, product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


@router.delete("/products/{product_id}")
def delete_product_endpoint(product_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    db_product = delete_product(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}
