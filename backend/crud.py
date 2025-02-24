from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash, verify_password

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def get_timeslots(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.TimeSlot).offset(skip).limit(limit).all()

def create_timeslot(db: Session, timeslot: dict):
    db_timeslot = models.TimeSlot(**timeslot)
    db.add(db_timeslot)
    db.commit()
    db.refresh(db_timeslot)
    return db_timeslot

def update_timeslot(db: Session, timeslot_id: int, timeslot: schemas.TimeSlotUpdate):
    db_timeslot = db.query(models.TimeSlot).filter(models.TimeSlot.id == timeslot_id).first()
    if db_timeslot:
        for key, value in timeslot.dict().items():
            setattr(db_timeslot, key, value)
        db.commit()
        db.refresh(db_timeslot)
    return db_timeslot

def delete_timeslot(db: Session, timeslot_id: int):
    db_timeslot = db.query(models.TimeSlot).filter(models.TimeSlot.id == timeslot_id).first()
    if db_timeslot:
        db.delete(db_timeslot)
        db.commit()
    return db_timeslot

def book_timeslot(db: Session, timeslot_id: int, user_id: int):
    db_timeslot = db.query(models.TimeSlot).filter(models.TimeSlot.id == timeslot_id).first()
    if db_timeslot and db_timeslot.user_id is None:
        db_timeslot.user_id = user_id
        db.commit()
        db.refresh(db_timeslot)
    return db_timeslot

def cancel_booking(db: Session, timeslot_id: int, user_id: int):
    db_timeslot = db.query(models.TimeSlot).filter(models.TimeSlot.id == timeslot_id, models.TimeSlot.user_id == user_id).first()
    if db_timeslot:
        db_timeslot.user_id = None
        db.commit()
        db.refresh(db_timeslot)
    return db_timeslot

def update_user_preferences(db: Session, user_id: int, preferences: str):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.preferences = preferences
        db.commit()
        db.refresh(db_user)
    return db_user

