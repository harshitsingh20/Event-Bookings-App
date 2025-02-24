from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List

from . import crud, models, schemas, auth
from .database import SessionLocal, engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# # Dependency
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/users", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.post("/timeslots")
def create_timeslot(
    timeslot: schemas.TimeSlotCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    time_slot = timeslot.dict()
    time_slot["user_id"] = time_slot.pop("userId")
    return crud.create_timeslot(db=db, timeslot=time_slot)

@app.get("/timeslots", response_model=List[schemas.TimeSlot])
def read_timeslots(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    timeslots = crud.get_timeslots(db, skip=skip, limit=limit)
    return timeslots

@app.put("/timeslots/{timeslot_id}", response_model=schemas.TimeSlot)
def update_timeslot(
    timeslot_id: int,
    timeslot: schemas.TimeSlotUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    return crud.update_timeslot(db=db, timeslot_id=timeslot_id, timeslot=timeslot)

@app.delete("/timeslots/{timeslot_id}", response_model=schemas.TimeSlot)
def delete_timeslot(
    timeslot_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    return crud.delete_timeslot(db=db, timeslot_id=timeslot_id)

@app.post("/book/{timeslot_id}", response_model=schemas.TimeSlot)
def book_timeslot(
    timeslot_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    return crud.book_timeslot(db=db, timeslot_id=timeslot_id, user_id=current_user.id)

@app.post("/cancel/{timeslot_id}", response_model=schemas.TimeSlot)
def cancel_booking(
    timeslot_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    return crud.cancel_booking(db=db, timeslot_id=timeslot_id, user_id=current_user.id)

@app.put("/users/{user_id}/preferences", response_model=schemas.User)
def update_user_preferences(
    user_id: int,
    preferences: schemas.UserPreferencesUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update other user's preferences")
    return crud.update_user_preferences(db=db, user_id=user_id, preferences=preferences.preferences)

