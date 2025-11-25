from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext

from .database import SessionLocal
from . import models

router = APIRouter(prefix="/auth")

SECRET_KEY = "super_secret_key"  # later move to .env
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



#  GET DB SESSION

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



#  CREATE JWT TOKEN

def create_access_token(data: dict, expires_minutes=60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



#  GET CURRENT USER (FIXED)

def get_current_user(token: str, db: Session):
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user



#  REGISTER

@router.post("/register")
def register(email: str, password: str, db: Session = Depends(get_db)):
    hashed = pwd_context.hash(password)
    user = models.User(email=email, password=hashed)

    db.add(user)
    try:
        db.commit()
    except:
        raise HTTPException(status_code=400, detail="Email already used")

    return {"message": "User created"}



#  LOGIN

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not pwd_context.verify(password, user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({"sub": user.email})
    return {"token": token}
