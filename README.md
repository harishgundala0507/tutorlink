# TutorLink

## Demo Video

Demo video link: [Add your demo video link here]

TutorLink is a full-stack tutor booking platform where students can discover tutors, filter by subject/location/price, and book available sessions, while tutors can manage their profiles, add teaching slots, and confirm or decline incoming bookings.

## Project Overview

This project is built as a MERN-style application with:

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB with Mongoose
- Authentication: JWT stored in HTTP-only cookies
- Booking flow: slot-based student bookings with tutor approvals

The platform is designed to make learning easier by connecting students to qualified tutors in a simple, user-friendly interface.

## Key Features

### For Students
- Register and log in as a student
- Browse tutors by subject, city, price, and teaching mode
- View tutor profiles and teaching details
- Book available slots for lessons
- Track all upcoming and past bookings

### For Tutors
- Register and log in as a tutor
- Create and manage profile details such as bio, subjects, education, hourly rate, and location
- Add teaching availability slots
- Remove unavailable slots
- View incoming booking requests
- Confirm or decline bookings and optionally add a meeting link

### Additional Functionality
- Protected routes based on role
- Secure password hashing with bcrypt
- Cookie-based session handling
- Filtered tutor search for faster discovery
- Real-time slot conflict prevention

## Tech Stack

### Frontend
- React
- React Router
- Vite
- Axios

### Backend
- Node.js
- Express.js
- Mongoose
- JWT
- bcrypt
- cookie-parser
- dotenv
- cors

## Folder Structure

```text
TutorLink/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── utils/
│   ├── .env
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── README.md
└── .gitignore
```

## How It Works

1. Users sign up as either a student or a tutor.
2. Tutors add their details and available time slots.
3. Students search and filter tutors based on their needs.
4. Students book an available slot for a particular subject.
5. Tutors review the request and either confirm or decline the booking.
6. Confirmed bookings can include a meeting link for the session.

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd TutorLink
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder with values such as:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tutorlink
CLIENT_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=your_secret_key
```

Then start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

The React app should run on:

```text
http://localhost:5173
```

The backend API should run on:

```text
http://localhost:5000
```

## Core API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `POST /api/auth/logout`

### Tutors
- `GET /api/tutors`
- `GET /api/tutors/:id`
- `GET /api/tutors/:id/slots`
- `POST /api/tutors/slots`
- `DELETE /api/tutors/slots/:slotId`

### Bookings
- `POST /api/bookings`
- `GET /api/bookings/my`
- `GET /api/bookings/incoming`
- `PATCH /api/bookings/:id/status`

## Project Status

This project is a functional tutor booking application with a complete frontend-backend flow for student and tutor interactions.

## Future Improvements

- Add payment integration
- Add chat or messaging between students and tutors
- Add admin dashboard
- Add notifications and reminders
- Improve search with advanced filters and sorting
- Add calendar view for tutor availability

## License

This project is for educational and portfolio demonstration purposes.

## Author / Team

TutorLink is developed as a full-stack learning project focused on tutoring and booking workflows.
