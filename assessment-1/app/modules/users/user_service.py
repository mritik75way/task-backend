from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.modules.users.user_model import User
from app.modules.users.user_schema import UserCreate
from app.core.security import hash_password, verify_password, create_access_token

def register_user(db: Session, data: UserCreate) -> User:
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def login_user(db: Session, email: str, password: str) -> str:
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    return create_access_token({"sub": str(user.id)})
