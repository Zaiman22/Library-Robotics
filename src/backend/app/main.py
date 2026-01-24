from fastapi import FastAPI, Depends
import os
from sqlmodel import create_engine, SQLModel, Session, select
from app.book import Book


# Setup database connection
DATABASE_URL = os.getenv("DATABASE_URL", "")
engine = create_engine(DATABASE_URL) # if using postgress
SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session


app = FastAPI()


@app.get("/check/")
async def read_item():
    status = {"url": DATABASE_URL}
    return status


@app.get("/books")
def read_books(session: Session = Depends(get_session)):
    statement = select(Book)
    books = session.exec(statement).all()
    return books

@app.post("/books/newBooks")
def insert_books(book: Book, session: Session = Depends(get_session)):
    session.add(book)
    session.commit()

@app.get("/items/{item_id}")
async def read_item(item_id: str, q: str | None = None, short: bool = False):
    item = {"item_id": item_id}
    if q:
        item.update({"q": q})
    if not short:
        item.update(
            {"description": "This is an amazing item that has a long description"}
        )
    return item