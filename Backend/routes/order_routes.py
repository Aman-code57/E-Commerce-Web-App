from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from crud.order_crud import get_orders, get_order, create_order, update_order_status
from schemas.order_schema import Order, OrderCreate
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


@router.get("/orders", response_model=list[Order])
def read_orders(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    orders = get_orders(db, user_id=current_user.id)
    return orders


@router.get("/orders/{order_id}", response_model=Order)
def read_order(order_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_order = get_order(db, order_id=order_id, user_id=current_user.id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order


@router.post("/orders", response_model=Order)
def create_order_endpoint(order: OrderCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return create_order(db, order, user_id=current_user.id)


@router.put("/orders/{order_id}/status")
def update_order_status_endpoint(
    order_id: int,
    status: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_order = update_order_status(db, order_id, status, user_id=current_user.id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order status updated"}
