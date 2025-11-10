from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from crud.cart_item_crud import get_cart_items, create_cart_item, update_cart_item, delete_cart_item
from schemas.cart_item_schema import CartItem, CartItemCreate
from core.security import verify_token
from fastapi.security import HTTPBearer
from crud.user_crud import get_user_by_email

router = APIRouter()
oauth2_scheme = HTTPBearer()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    username = verify_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user_by_email(db, email=username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/cart", response_model=list[CartItem])
def read_cart(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    cart_items = get_cart_items(db, user_id=current_user.id)
    return cart_items


@router.post("/cart", response_model=CartItem)
def add_to_cart(cart_item: CartItemCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return create_cart_item(db, cart_item, user_id=current_user.id)


@router.put("/cart/{cart_item_id}", response_model=CartItem)
def update_cart_item_endpoint(
    cart_item_id: int,
    cart_item: CartItemCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_cart_item = update_cart_item(db, cart_item_id, cart_item, user_id=current_user.id)
    if db_cart_item is None:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return db_cart_item


@router.delete("/cart/{cart_item_id}")
def remove_from_cart(cart_item_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_cart_item = delete_cart_item(db, cart_item_id, user_id=current_user.id)
    if db_cart_item is None:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Cart item deleted"}
