import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models
from .auth import router as auth_router
from .routes.project_routes import router as project_router
from .routes.content_routes import router as content_router

app = FastAPI()

#      ENABLE CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # dev: allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#      ROUTERS

app.include_router(auth_router)
app.include_router(project_router)
app.include_router(content_router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"status": "backend running"}
