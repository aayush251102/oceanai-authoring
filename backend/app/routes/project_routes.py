from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import json
from pydantic import BaseModel
from typing import List

from ..database import SessionLocal
from ..models import Project, User

router = APIRouter(prefix="/projects")

SECRET_KEY = "super_secret_key"
ALGORITHM = "HS256"


# DB SESSION

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# GET CURRENT USER

def get_current_user(token: str, db: Session):
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user



# CREATE PROJECT

@router.post("/create")
def create_project(
    title: str,
    doc_type: str,
    topic: str,
    token: str,
    db: Session = Depends(get_db),
):

    user = get_current_user(token, db)

    project = Project(
        user_id=user.id,
        title=title,
        doc_type=doc_type,
        topic=topic,
        outline="[]",
        content="{}",
        history="{}",
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return {"message": "Project created", "project_id": project.id}



# OUTLINE MODEL

class OutlineModel(BaseModel):
    outline: List[str]


@router.post("/{project_id}/set-outline")
def set_outline(
    project_id: int,
    data: OutlineModel,
    token: str,
    db: Session = Depends(get_db),
):

    user = get_current_user(token, db)

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project or project.user_id != user.id:
        raise HTTPException(status_code=404, detail="Project not found")

    project.outline = json.dumps(data.outline)
    db.commit()

    return {"message": "Outline saved"}



#  NEW AI OUTLINE (NO PROJECT CREATED)

class AIOutlineRequest(BaseModel):
    topic: str
    doc_type: str


@router.post("/ai-outline")
def ai_outline_request(data: AIOutlineRequest):

    if data.doc_type == "docx":
        sections = [
            "Introduction",
            "Background",
            "Problem Statement",
            "Analysis",
            "Solution",
            "Conclusion"
        ]
    else:
        sections = [
            "Title Slide",
            "Agenda",
            "Problem",
            "Approach",
            "Results",
            "Conclusion"
        ]

    return {
        "suggested_outline": {
            "sections": sections
        }
    }



# OLD AI OUTLINE (optional keep)

@router.post("/{project_id}/ai-outline")
def ai_suggest_outline(
    project_id: int,
    token: str,
    db: Session = Depends(get_db),
):

    user = get_current_user(token, db)

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project or project.user_id != user.id:
        raise HTTPException(status_code=404, detail="Project not found")

    suggested = {
        "sections": [
            "Introduction",
            "Industry Background",
            "Market Analysis",
            "Future Trends",
            "Conclusion"
        ]
    }

    return {"suggested_outline": suggested}



# GET ALL PROJECTS

@router.get("/all")
def get_all_projects(token: str, db: Session = Depends(get_db)):

    user = get_current_user(token, db)
    projects = db.query(Project).filter(Project.user_id == user.id).all()
    return projects



# GET SINGLE PROJECT

@router.get("/{project_id}")
def get_project(project_id: int, token: str, db: Session = Depends(get_db)):

    user = get_current_user(token, db)
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project or project.user_id != user.id:
        raise HTTPException(status_code=404, detail="Project not found")

    return project
