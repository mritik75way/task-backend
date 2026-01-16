from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from db.session import get_session
from db.models import User, UserCreate, Token, UserPublic
from core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth",tags=["Authentication"])

@router.post("/signup", response_model=UserPublic)
def signup(user_in: UserCreate, session: Session = Depends(get_session)):
    user_exists = session.exec(select(User).where(User.username == user_in.username)).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="User already exists")
    
    db_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hash_password(user_in.password)
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    session: Session = Depends(get_session)
):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    return {
        "access_token": create_access_token(user.username),
        "token_type": "bearer",
    }