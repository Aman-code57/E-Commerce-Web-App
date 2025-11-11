from sqlalchemy.orm import Session
from models.user import User
from schemas.user_schema import UserCreate, ResetPasswordRequest
from core.security import get_password_hash, verify_password
from core.email import send_email
from core.config import settings
from datetime import datetime, timedelta
import random
import string


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    # Check if this is the first user
    is_first_user = db.query(User).count() == 0
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        phoneno=user.phoneno,
        address=user.address,
        gender=user.gender,
        is_admin=is_first_user  
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user


def generate_otp(db: Session, email: str):
    user = get_user_by_email(db, email)
    if not user:
        return None

    otp = ''.join(random.choices(string.digits, k=6))
    expiry = datetime.utcnow() + timedelta(minutes=1)
    user.otp_code = otp
    user.otp_expiry = expiry
    db.commit()
    db.refresh(user)

    subject = "🔐 Your OTP for Password Reset"

    fullname = user.name if user.name else "User"

    html_body = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OTP Verification</title>
        <style>
            body {{
                font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background: linear-gradient(135deg, #0077ff, #00b4d8);
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                color: #333;
            }}
            .card {{
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                padding: 35px 25px;
                width: 90%;
                max-width: 420px;
                text-align: center;
                animation: fadeIn 0.6s ease-in-out;
            }}
            @keyframes fadeIn {{
                from {{ opacity: 0; transform: translateY(10px); }}
                to {{ opacity: 1; transform: translateY(0); }}
            }}
            h2 {{
                color: #0077ff;
                font-size: 22px;
                margin-bottom: 6px;
                letter-spacing: 0.4px;
            }}
            .greeting {{
                font-size: 16px;
                color: #444;
                margin-bottom: 20px;
            }}
            p {{
                font-size: 15px;
                color: #555;
                line-height: 1.6;
                margin: 10px 0;
            }}
            .otp-code {{
                display: inline-block;
                background: linear-gradient(90deg, #0077ff, #00b4d8);
                color: #fff;
                font-size: 28px;
                font-weight: bold;
                letter-spacing: 5px;
                border-radius: 10px;
                padding: 14px 28px;
                margin: 20px 0;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }}
            .footer {{
                font-size: 12px;
                color: #999;
                margin-top: 25px;
                border-top: 1px solid #eee;
                padding-top: 15px;
            }}
            @media (max-width: 480px) {{
                .card {{
                    padding: 25px 15px;
                }}
                .otp-code {{
                    font-size: 22px;
                    padding: 10px 20px;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="card">
            <h2>Password Reset Verification</h2>
            <p class="greeting">Hello {fullname},</p>
            <p>Use the OTP below to reset your password.</p>
            <div class="otp-code">{otp}</div>
            <p>This OTP will expire in <strong>1 minute</strong>.</p>
            <p>If you didn’t request a password reset, please ignore this email.</p>
            <div class="footer">© {datetime.utcnow().year} E-Commerce Inc. All rights reserved.</div>
        </div>
    </body>
    </html>
    """

    if not send_email(email, subject, html_body, is_html=True):
        return None

    return otp



def verify_otp(db: Session, email: str, otp: str):
    user = get_user_by_email(db, email)
    if not user or user.otp_code != otp or user.otp_expiry < datetime.utcnow():
        return False
    return True


def reset_password(db: Session, email: str, new_password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    hashed_password = get_password_hash(new_password)
    user.password_hash = hashed_password
    user.otp_code = None
    user.otp_expiry = None
    db.commit()
    db.refresh(user)
    return True


def get_user_by_token(db: Session, token: str):
    from core.security import verify_token
    payload = verify_token(token)
    if not payload:
        return None
    email = payload.get("sub")
    if not email:
        return None
    return get_user_by_email(db, email)

def get_all_users(db: Session):
    return db.query(User).all()


def update_user(db: Session, user_id: int, update_data):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    for key, value in update_data.items():
        if value is not None:
            setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user
