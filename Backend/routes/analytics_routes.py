from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from crud.order_crud import get_all_orders
from crud.product_crud import get_products
from core.security import verify_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from crud.user_crud import get_user_by_email
from crud.user_crud import get_all_users
from models.order_item import OrderItem
from models.order import Order
from models.product import Product
from models.user import User
from datetime import datetime, timedelta
from sqlalchemy import func, desc

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

@router.get("/analytics")
def get_analytics(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    orders = get_all_orders(db)
    products = get_products(db)
    users = get_all_users(db)

    total_orders = len(orders)
    total_revenue = sum(order.total_amount for order in orders)
    total_products = len(products)
    total_users = len(users)

    # Simple status counts
    order_status_counts = {}
    for order in orders:
        status = order.status
        order_status_counts[status] = order_status_counts.get(status, 0) + 1

    # Recent orders (last 10)
    recent_orders = sorted(orders, key=lambda x: x.created_at, reverse=True)[:10]
    recent_orders_data = [
        {
            "id": order.id,
            "user": order.user.username,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at.isoformat()
        } for order in recent_orders
    ]

    # ✅ FIXED: Top-selling products (top 5)
    top_products_query = (
        db.query(
            Product.id,
            Product.name,
            func.sum(OrderItem.quantity).label('total_sold')
        )
        .join(Product, Product.id == OrderItem.product_id)
        .group_by(Product.id, Product.name)
        .order_by(desc('total_sold'))
        .limit(5)
        .all()
    )

    top_products = [
        {
            "id": product.id,
            "name": product.name,
            "total_sold": product.total_sold
        }
        for product in top_products_query
    ]

    # Revenue trends (monthly for last 12 months)
    now = datetime.utcnow()
    revenue_trends = []
    for i in range(12):
        month_start = (now - timedelta(days=30*i)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(seconds=1)
        monthly_revenue = db.query(func.sum(Order.total_amount)).filter(
            Order.created_at >= month_start,
            Order.created_at <= month_end
        ).scalar() or 0
        revenue_trends.append({
            "month": month_start.strftime("%Y-%m"),
            "revenue": monthly_revenue
        })
    revenue_trends.reverse()

    # User statistics
    active_users_30_days = db.query(User).filter(
        User.created_at >= (now - timedelta(days=30))
    ).count()

    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "total_products": total_products,
        "total_users": total_users,
        "order_status_counts": order_status_counts,
        "recent_orders": recent_orders_data,
        "top_products": top_products,
        "revenue_trends": revenue_trends,
        "active_users_30_days": active_users_30_days
    }

