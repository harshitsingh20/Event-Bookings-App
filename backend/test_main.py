from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .database import Base
from .main import app, get_db
import pytest

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_user():
    response = client.post(
        "/register",
        json={"email": "test@example.com", "password": "testpassword", "name": "Test User"}
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    user_id = data["id"]

    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"

def test_create_timeslot():
    response = client.post(
        "/register",
        json={"email": "admin@example.com", "password": "adminpassword", "name": "Admin User"}
    )
    assert response.status_code == 200, response.text

    login_response = client.post(
        "/token",
        data={"username": "admin@example.com", "password": "adminpassword"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    response = client.post(
        "/timeslots",
        json={
            "category": "Cat 1",
            "start": "2023-06-01T10:00:00",
            "end": "2023-06-01T11:00:00"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["category"] == "Cat 1"
    assert "id" in data

def test_book_timeslot():
    # Create a user
    response = client.post(
        "/register",
        json={"email": "user@example.com", "password": "userpassword", "name": "Regular User"}
    )
    assert response.status_code == 200, response.text
    user_id = response.json()["id"]

    # Login
    login_response = client.post(
        "/token",
        data={"username": "user@example.com", "password": "userpassword"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # Create a timeslot
    timeslot_response = client.post(
        "/timeslots",
        json={
            "category": "Cat 2",
            "start": "2023-06-02T14:00:00",
            "end": "2023-06-02T15:00:00"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert timeslot_response.status_code == 200
    timeslot_id = timeslot_response.json()["id"]

    # Book the timeslot
    book_response = client.post(
        f"/book/{timeslot_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert book_response.status_code == 200
    booked_timeslot = book_response.json()
    assert booked_timeslot["user_id"] == user_id

if __name__ == "__main__":
    pytest.main([__file__])

