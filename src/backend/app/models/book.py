from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class Book(SQLModel, table=True):
    __tablename__ = "book"

    id: Optional[int] = Field(default=None, primary_key=True)

    title: str = Field(index=True)
    author: Optional[str] = None
    short_description: Optional[str] = None
    image_url: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)

    # relationships
    copies: List["BookStatus"] = Relationship(back_populates="book")
    minor_tags: List["BookMinorTag"] = Relationship(back_populates="book")


class BookMinorTag(SQLModel, table=True):
    __tablename__ = "book_minor_tag"

    book_id: int = Field(foreign_key="book.id", primary_key=True)
    minor_tag_id: int = Field(foreign_key="minor_tag.id", primary_key=True)

    book: Optional["Book"] = Relationship(back_populates="minor_tags")
    minor_tag: Optional["MinorTag"] = Relationship(back_populates="book_links")


class MinorTag(SQLModel, table=True):
    __tablename__ = "minor_tag"

    id: Optional[int] = Field(default=None, primary_key=True)
    major_tag_id: int = Field(foreign_key="major_tag.id")
    name: str = Field(index=True)

    book_links: List["BookMinorTag"] = Relationship(back_populates="minor_tag")
    major_tag: Optional["MajorTag"] = Relationship(back_populates="minor_tags")


class MajorTag(SQLModel, table=True):
    __tablename__ = "major_tag"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)

    minor_tags: List["MinorTag"] = Relationship(back_populates="major_tag")


class BookStatus(SQLModel, table=True):
    __tablename__ = "book_status"

    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: int = Field(foreign_key="book.id")
    status_id: int = Field(foreign_key="book_status_tag.id")

    book: Optional["Book"] = Relationship(back_populates="copies")
    status: Optional["BookStatusTag"] = Relationship(back_populates="copies")


class BookStatusTag(SQLModel, table=True):
    __tablename__ = "book_status_tag"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)

    copies: List["BookStatus"] = Relationship(back_populates="status")


#  Get type schema

class GetBookType(SQLModel):
    id: int
    title: str
    author: str
    short_description: Optional[str]
    categories: List[str]
    image: str
    total_copies: int

class GetMinorTags(SQLModel):
    id: int
    minor_tag: str
    major_tag_id: int

class GetMajorTags(SQLModel):
    id: int
    major_tag: str


class GetBookStatus(SQLModel):
    id: int
    bookTitle: str
    status: str

class GetSpecificBook(SQLModel):
    id: int
    title: str
    author: str
    short_description: Optional[str]
    categories: List[str]
    image: str
    total_copies: int
