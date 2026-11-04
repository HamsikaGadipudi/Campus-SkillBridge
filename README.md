# Campus Skill Exchange & Peer Learning Platform

A MERN starter project where students can offer skills, discover peer tutors, request learning sessions, and review completed sessions.

## Stack
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication + bcrypt password hashing

## Requirements
- Node.js 18+
- MongoDB local installation or MongoDB Atlas connection string

## Setup

### 1. Backend
```bash
cd server
cp .env.example .env
# Set MONGO_URI and JWT_SECRET in .env
npm install
npm run dev
```
The API runs at `http://localhost:5000`.

### 2. Frontend
Open another terminal:
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

Create a student account, sign in, add a skill, and browse the marketplace.

## Main API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST /api/skills`
- `GET/PUT/DELETE /api/skills/:id`
- `POST /api/bookings`
- `GET /api/bookings/mine`
- `PATCH /api/bookings/:id/status`
- `POST /api/reviews`
- `GET /api/reviews/skill/:skillId`

## Notes
- This is a learning/demo MVP, not a production deployment.
- Chat is represented as a clear UI placeholder in this starter; real-time chat can be added with Socket.IO.
- For production, add rate limiting, email verification, stronger validation, moderation/reporting, and secure deployment settings.
