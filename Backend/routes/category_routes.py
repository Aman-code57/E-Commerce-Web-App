from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from crud.category_crud import get_categories, get_category, create_category, update_category, delete_category
from schemas.category_schema import Category, CategoryCreate

router = APIRouter()


@router.get("/categories", response_model=list[Category])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    categories = get_categories(db, skip=skip, limit=limit)
    return categories


@router.get("/categories/{category_id}", response_model=Category)
def read_category(category_id: int, db: Session = Depends(get_db)):
    db_category = get_category(db, category_id=category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category


@router.post("/categories", response_model=Category)
def create_category_endpoint(category: CategoryCreate, db: Session = Depends(get_db)):
    return create_category(db, category)


@router.put("/categories/{category_id}", response_model=Category)
def update_category_endpoint(category_id: int, category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = update_category(db, category_id, category)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category


@router.delete("/categories/{category_id}")
def delete_category_endpoint(category_id: int, db: Session = Depends(get_db)):
    db_category = delete_category(db, category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted"}
