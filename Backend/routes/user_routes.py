from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database.connection import get_db
from crud.user_crud import get_user_by_email, create_user, authenticate_user, generate_otp, verify_otp, reset_password
from schemas.user_schema import UserResponse, UserCreate, Token, LoginRequest, ForgotPasswordRequest, VerifyOtpRequest, ResetPasswordRequest
from core.security import create_access_token, verify_token

router = APIRouter()
oauth2_scheme = HTTPBearer()


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="email already registered")
    return create_user(db, user)


@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    otp = generate_otp(db, request.email)
    if not otp:
        raise HTTPException(status_code=500, detail="Failed to send OTP email")
    return {"message": "OTP sent to your email"}


@router.post("/verify-otp")
def verify_otp_endpoint(request: VerifyOtpRequest, db: Session = Depends(get_db)):
    if not verify_otp(db, request.email, request.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return {"message": "OTP verified successfully"}


@router.post("/reset-password")
def reset_password_endpoint(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    # For simplicity, require OTP again; in production, use session or token
    if not verify_otp(db, request.email, request.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    if not reset_password(db, request.email, request.new_password):
        raise HTTPException(status_code=500, detail="Failed to reset password")
    return {"message": "Password reset successfully"}





