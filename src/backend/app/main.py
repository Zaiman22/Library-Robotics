from fastapi.staticfiles import StaticFiles
import shutil
import os
from sqlalchemy.orm import selectinload

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext

from sqlmodel import create_engine, SQLModel, Session, select
from pydantic import BaseModel
from app.models.book import *
from app.models.user import User, UserCreate

from fastapi.middleware.cors import CORSMiddleware

from app.auth import hash_password, verify_password, create_access_token, SECRET_KEY, ALGORITHM



# Setup database connection
DATABASE_URL = os.getenv("DATABASE_URL", "")
engine = create_engine(DATABASE_URL) # if using postgress
SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|172\.\d+\.\d+\.\d+)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


from app.routers.auth_router import router as auth_router
app.include_router(auth_router)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

ACCESS_TOKEN_EXPIRE_MINUTES = 60

# preparing static file
IMG_UPLOAD_DIR = "server_data/img"
app.mount("/server_data/img", StaticFiles(directory=IMG_UPLOAD_DIR), name="image")


def get_user_by_username(
    username: str,
    session: Session = Depends(get_session)
):
    query = select(User).where(User.username == username)
    result = session.exec(query).first()
    return result


def create_user(user:UserCreate, session: Session = Depends(get_session)):
    hashed_password = hash_password(user.password)
    db_user = User(full_name=user.full_name, email = user.email, username=user.username, hashed_password=hashed_password)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return "complete"

def authenticate_user(username: str, password: str, session: Session = Depends(get_session)):
    query = select(User).where(User.username == username)
    user = session.exec(query).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user



@app.post("/register")
def register_user(user: UserCreate, session: Session = Depends(get_session)):
    db_user = get_user_by_username(username=user.username,session = session)
    if db_user:
        raise HTTPException(status_code=400, detail=f"Username already registered {db_user}")
    return create_user(session=session, user=user)


@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = authenticate_user(form_data.username, form_data.password, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=403, detail="Token is invalid or expired")
        return payload
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is invalid or expired")

@app.get("/verify-token/{token}")
async def verify_user_token(token: str):
    verify_token(token=token)
    return {"message": "Token is valid"}




@app.get("/manage/book/get_type", response_model=List[GetBookType])
def read_books(session: Session = Depends(get_session)):

    statement = (
        select(Book)
        .options(
            selectinload(Book.copies),
            selectinload(Book.minor_tags)
                .selectinload(BookMinorTag.minor_tag)
        )
    )

    books = session.exec(statement).all()

    result = []

    for book in books:
        result.append(
            GetBookType(
                id=book.id,
                title=book.title,
                author=book.author,
                short_description=book.short_description,
                categories=[
                    link.minor_tag.name
                    for link in book.minor_tags
                    if link.minor_tag
                ],
                image=book.image_url,
                total_copies=len(book.copies),
            )
        )

    return result

from fastapi import HTTPException

@app.get("/manage/book/get_type/{book_id}", response_model=GetBookType)
def read_book(book_id: int, session: Session = Depends(get_session)):

    statement = (
        select(Book)
        .where(Book.id == book_id)
        .options(
            selectinload(Book.copies),
            selectinload(Book.minor_tags)
                .selectinload(BookMinorTag.minor_tag)
        )
    )

    book = session.exec(statement).first()

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    return GetBookType(
        id=book.id,
        title=book.title,
        author=book.author,
        short_description=book.short_description,
        categories=[
            link.minor_tag.name
            for link in book.minor_tags
            if link.minor_tag
        ],
        image=book.image_url,
        total_copies=len(book.copies),
    )

@app.get("/manage/book/get_minor_tag", response_model=List[GetMinorTags])
def get_minor_tag(session: Session = Depends(get_session)):
    statement = (
        select(MinorTag)
    )

    tags = session.exec(statement).all()

    result = []
    for tag in tags:
        result.append(GetMinorTags(
            id = tag.id,
            minor_tag = tag.name,
            major_tag_id = tag.major_tag_id
        ))

    return result


@app.get("/manage/book/get_major_tag", response_model=List[GetMajorTags])
def get_major_tag(session: Session = Depends(get_session)):
    statement = (
        select(MajorTag)
    )

    tags = session.exec(statement).all()

    result = []
    for tag in tags:
        result.append(GetMajorTags(
            id = tag.id,
            major_tag = tag.name
        ))

    return result


@app.post("/manage/book/create_book_type")
async def create_book_type(
    title: str = Form(...),
    author: str = Form(...),
    short_description: str = Form(...),
    categories: str = Form(...),  # JSON string
    image: UploadFile = File(...),
    session: Session = Depends(get_session),
    _: dict = Depends(verify_token)
):
    print("uploaded")
    # sanitize title and author
    safe_title = title.replace(" ", "_")
    safe_author = author.replace(" ", "_")

    # get file extension
    ext = os.path.splitext(image.filename)[1]

    # create new filename
    filename = f"{safe_title}_{safe_author}{ext}"

    filepath = os.path.join(IMG_UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    image_url = f"/img/{filename}"
    print("uploaded")

    # Create book
    book = Book(
        title=title,
        author=author,
        short_description=short_description,
        image_url=image_url,
    )

    session.add(book)
    session.commit()
    session.refresh(book)

    # Convert categories string to list
    import json
    category_list = json.loads(categories)

    # Link categories
    for cat_name in category_list:

        tag = session.exec(
            select(MinorTag).where(MinorTag.name == cat_name)
        ).first()

        if tag:
            link = BookMinorTag(
                book_id=book.id,
                minor_tag_id=tag.id
            )
            session.add(link)

    session.commit()

    return {"message": "Book created successfully"}


@app.post("/manage/book/create_major_tag")
async def create_major_tag(
    name: str = Form(...),
    session: Session = Depends(get_session),
    _: dict = Depends(verify_token)
):

    # Create book
    major_tag = MajorTag(
        name=name
    )

    session.add(major_tag)
    session.commit()
    session.refresh(major_tag)

    session.commit()

    return {"message": "Major tag created successfully"}



@app.post("/manage/book/create_minor_tag")
async def create_minor_tag(
    name: str = Form(...),
    major_tag: int = Form(...),
    session: Session = Depends(get_session),
    _: dict = Depends(verify_token)
):


    minor_tag = MinorTag(
        name=name,
        major_tag_id = major_tag
    )

    session.add(minor_tag)
    session.commit()
    session.refresh(minor_tag)

    session.commit()

    return {"message": "Minor tag created successfully"}