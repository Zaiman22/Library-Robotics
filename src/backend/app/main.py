from fastapi import FastAPI
import os
from sqlmodel import create_engine, SQLModel, Session
import app.book


# Setup database connection
DATABASE_URl = os.getenv("DATABASE_URL", "")
engine = create_engine(DATABASE_URl, connect_args={"check_same_thread": False})
# SQLModel.metadata.create_all(engine)

app = FastAPI()


@app.get("/check/")
async def read_item():
    status = {"url": DATABASE_URl}
    return status


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