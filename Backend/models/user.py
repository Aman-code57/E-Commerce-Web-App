from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from database.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phoneno = Column(String(15))
    password_hash = Column(String(255), nullable=False)
    address = Column(String(255))
    gender = Column(String(10))
    is_admin = Column(Boolean, default=False)
    otp_code = Column(String(6), nullable=True)
    otp_expiry = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
