# Event Booking Application

A React-based event booking application that allows users to book events from pre-defined slots in the calendar.

## Features

- Register the user
- Login the User
- User preferences for event categories
- Weekly calendar view with event filtering
- Event booking and cancellation
- Admin panel for managing time slots
- Local storage for data persistence

## Prerequisites

Ensure you have the following installed:

Node.js (>= 16.x)

```bash
npm 
```

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
```

2. Navigate to the project directory
```bash
cd event-booking-app
```

3. Install all dependencies:
```bash
npm install
```
Or
```bash
npm i
```

4. Start the Frontend development server:
```bash
npm run dev
```

5. Open [[http://localhost:3000](http://localhost:3000)] in your local browser for frontend.

6. Navigate to the backend directory

```bash
cd backend
```

7. Open virtual venv and activate it:
```bash
python3 -m venv venv
```
```bash
source venv/bin/activate
```

8. Install all dependencies:
```bash
pip install -r requirements.txt
```

8. Come back to event-bookings-app :
```bash
cd ..
```

8. Start the Backend development server:
```bash
python -m uvicorn backend.main:app --reload
```

## Example
![Screenshot from 2025-02-24 22-19-38](https://github.com/user-attachments/assets/b9f06010-8a17-455c-aba9-01836e551885)

9. Open [[http://127.0.0.1:8000](http://127.0.0.1:8000/)] in your local browser for backend.

10. If you want to see all the api's open swagger
```bash
http://127.0.0.1:8000/docs#/
```
# Image
![image](https://github.com/user-attachments/assets/8b67ab49-4cd6-4822-9773-2ab08816b1c5)

## Usage

### User View
- Register the user
- Login the User
- Select your preferred event categories in the Preferences page
- View and book available time slots in the Calendar view
- Cancel your bookings from the Calendar view
- Time slot should accept only one user.

### Admin View
- Add new time slots with category and time range
- View all time slots and their booking status
- Delete time slots
- Edit time slots

## Technical Details

 Built with:
- React
- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Next.js API routes
- Python
- fastAPI
- Swagger
- sqlalchemy
- Local storage for data persistence


# Images
## Register View
![image](https://github.com/user-attachments/assets/88e3bead-a71b-4a83-ad5d-71e3367313d6)

## Login View
![image](https://github.com/user-attachments/assets/9cdf82b4-129f-4288-926e-e72242689de5)

## Calendar View
![image](https://github.com/user-attachments/assets/e6cd7567-acbd-4a6f-a4f0-312d6d40e300)

## User Preferences View
![image](https://github.com/user-attachments/assets/ba1c89e5-6fbb-4607-a84a-bad1fa200ff2)

## Admin View
![image](https://github.com/user-attachments/assets/61639dee-6f1d-4b19-9226-458959b99eda)



