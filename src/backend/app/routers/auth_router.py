from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlmodel import Session, select

from app.models.user import User
from app.auth import verify_password, create_access_token
from app.main import get_session

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(data: LoginRequest, session: Session = Depends(get_session)):

    user = session.exec(select(User).where(User.email == data.email)).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User inactive")

    token = create_access_token({
        "sub": user.email,
        "user_id": user.id,
        "is_admin": user.is_admin
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }