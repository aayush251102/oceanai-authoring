from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    password = Column(String)

    projects = relationship("Project", back_populates="user")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    doc_type = Column(String)   # 'docx' or 'pptx'
    topic = Column(String)
    
    outline = Column(Text)      # JSON stored as text
    content = Column(Text)      # JSON stored as text
    history = Column(Text)      # JSON stored as text

    user = relationship("User", back_populates="projects")
