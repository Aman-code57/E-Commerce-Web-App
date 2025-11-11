from sqlalchemy.orm import Session
from models.order import Order
from models.order_item import OrderItem
from schemas.order_schema import OrderCreate


def get_orders(db: Session, user_id: int):
    return db.query(Order).filter(Order.user_id == user_id).all()


def get_all_orders(db: Session):
    return db.query(Order).all()


def get_order(db: Session, order_id: int, user_id: int):
    return db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()


def create_order(db: Session, order: OrderCreate, user_id: int):
    db_order = Order(total_amount=order.total_amount, status=order.status, user_id=user_id)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
        db_order_item = OrderItem(order_id=db_order.id, **item.dict())
        db.add(db_order_item)
    db.commit()
    db.refresh(db_order)
    return db_order


def update_order_status(db: Session, order_id: int, status: str, user_id: int):
    db_order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
    if db_order:
        db_order.status = status
        db.commit()
        db.refresh(db_order)
    return db_order
