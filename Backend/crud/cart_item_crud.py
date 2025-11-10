from sqlalchemy.orm import Session
from models.cart_item import CartItem
from schemas.cart_item_schema import CartItemCreate


def get_cart_items(db: Session, user_id: int):
    return db.query(CartItem).filter(CartItem.user_id == user_id).all()


def get_cart_item(db: Session, cart_item_id: int, user_id: int):
    return db.query(CartItem).filter(CartItem.id == cart_item_id, CartItem.user_id == user_id).first()


def create_cart_item(db: Session, cart_item: CartItemCreate, user_id: int):
    db_cart_item = CartItem(**cart_item.dict(), user_id=user_id)
    db.add(db_cart_item)
    db.commit()
    db.refresh(db_cart_item)
    return db_cart_item


def update_cart_item(db: Session, cart_item_id: int, cart_item: CartItemCreate, user_id: int):
    db_cart_item = db.query(CartItem).filter(CartItem.id == cart_item_id, CartItem.user_id == user_id).first()
    if db_cart_item:
        for key, value in cart_item.dict().items():
            setattr(db_cart_item, key, value)
        db.commit()
        db.refresh(db_cart_item)
    return db_cart_item


def delete_cart_item(db: Session, cart_item_id: int, user_id: int):
    db_cart_item = db.query(CartItem).filter(CartItem.id == cart_item_id, CartItem.user_id == user_id).first()
    if db_cart_item:
        db.delete(db_cart_item)
        db.commit()
    return db_cart_item
