from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    preferences: Optional[str] = None

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class TimeSlotBase(BaseModel):
    category: str
    start: datetime
    end: datetime

class TimeSlotCreate(TimeSlotBase):
    id: str
    userId: Optional[str] = None

class TimeSlotUpdate(TimeSlotBase):
    pass

class TimeSlot(TimeSlotBase):
    id: int
    user_id: Optional[int] = None

    class Config:
        from_attributes = True

class UserPreferencesUpdate(BaseModel):
    preferences: str

