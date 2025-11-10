from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine, Base
from routes import user_routes, category_routes, product_routes, cart_routes, order_routes

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes.router, prefix="/api", tags=["users"])
app.include_router(category_routes.router, prefix="/api", tags=["categories"])
app.include_router(product_routes.router, prefix="/api", tags=["products"])
app.include_router(cart_routes.router, prefix="/api", tags=["cart"])
app.include_router(order_routes.router, prefix="/api", tags=["orders"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the E-Commerce API"}
