from sqlmodel import SQLModel, Field, Session, create_engine, select
from datetime import datetime

# build models 
class Book(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str  
    author: str | None = None
    description: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)



# insert new book
class NewBook(SQLModel):
    title: str
    author: str
    description: str|None = None

