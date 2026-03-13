from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from pydantic import constr


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)

    full_name: str = Field(max_length=100)
    email: str = Field(max_length=150, unique=True, index=True)
    username: str = Field(max_length=50, unique=True)
    hashed_password: str

    is_active: bool = Field(default=True)
    is_admin: bool = Field(default=False)

    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(SQLModel):
    full_name: str = Field(max_length=100)
    email: str = Field(max_length=150)
    username: str = Field(max_length=50)
    password: constr(min_length=8, max_length=72)