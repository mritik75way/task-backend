from typing import Optional
from sqlmodel import Field
from .base import SQLModel

class UserBase(SQLModel):
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True)

class UserCreate(UserBase):
    password: str 

class UserPublic(UserBase):
    id: int

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"