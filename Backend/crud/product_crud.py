from sqlalchemy.orm import Session, joinedload
from models.product import Product
from models.category import Category
from schemas.product_schema import ProductCreate


def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Product).options(joinedload(Product.category)).offset(skip).limit(limit).all()


def get_product(db: Session, product_id: int):
    return db.query(Product).options(joinedload(Product.category)).filter(Product.id == product_id).first()


def get_or_create_category(db: Session, category_name: str):
    category = db.query(Category).filter(Category.name == category_name).first()
    if not category:
        category = Category(name=category_name)
        db.add(category)
        db.commit()
        db.refresh(category)
    return category


def create_product(db: Session, product: ProductCreate):
    category = get_or_create_category(db, product.category)
    db_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        category_id=category.id,
        image=product.image
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    # Load the category relationship
    db.refresh(db_product, attribute_names=['category'])
    return db_product


def update_product(db: Session, product_id: int, product: ProductCreate):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product:
        category = get_or_create_category(db, product.category)
        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.category_id = category.id
        db_product.image = product.image
        db.commit()
        db.refresh(db_product)
        # Load the category relationship
        db.refresh(db_product, attribute_names=['category'])
    return db_product


def delete_product(db: Session, product_id: int):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product
