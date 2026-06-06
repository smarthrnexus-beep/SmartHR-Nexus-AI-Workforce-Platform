# SmartHR Nexus — AI Workforce Platform

AI-powered Human Resource Management System for enterprises supporting **5,000+ employees**.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MongoDB%20%7C%20Gemini-6366f1?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Overview

SmartHR Nexus is a full-stack HRMS with role-based dashboards, real-time attendance, payroll, recruitment pipelines, and an AI assistant (**ARIA**) powered by **Google Gemini**. Built with React 18, Node.js, MongoDB, Redis, and Socket.io.

**Repository:** [github.com/adityakr1108/SmartHR-Nexus-AI-Workforce-Platform](https://github.com/adityakr1108/SmartHR-Nexus-AI-Workforce-Platform)

---

## Features

| Module | Capabilities |
|--------|-------------|
| **Employees** | CRUD, departments, profiles, soft delete |
| **Attendance** | Check-in/out, live dashboard, work modes |
| **Leave** | Requests, manager approvals, balance tracking |
| **Payroll** | Salary processing, payslips, approvals |
| **Performance** | Reviews, goals, team analytics |
| **Recruitment** | Job listings, candidate pipeline, resume screening |
| **AI (ARIA)** | HR chat assistant, resume scoring, insights |
| **Real-time** | WebSocket notifications and live updates |

---

## Project Structure

```
SmartHR/
├── frontend/                 # React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/       # common, layout, dashboard
│   │   ├── pages/            # auth, admin, manager, recruiter, employee, shared
│   │   ├── store/            # Redux Toolkit slices
│   │   └── services/         # API client + Gemini AI
│   └── vite.config.js
├── backend/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── config/           # MongoDB, Redis
│   │   ├── controllers/      # Route handlers
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth, validation, errors
│   │   ├── services/         # AI + email
│   │   └── utils/            # Logger, seeder, sockets
│   └── uploads/
├── docker-compose.yml
└── package.json              # npm workspaces (frontend + backend)
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6+
- Redis 7+
- Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### 1. Clone & install

```bash
git clone https://github.com/adityakr1108/SmartHR-Nexus-AI-Workforce-Platform.git
cd SmartHR-Nexus-AI-Workforce-Platform

npm run install:all
```

### 2. Configure backend

```bash
cd backend
cp .env.example .env
```

Set at minimum: `MONGODB_URI`, `REDIS_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GEMINI_API_KEY`.

### 3. Configure frontend

```bash
cd frontend
cp .env.example .env
```

Set `VITE_GEMINI_API_KEY` for the ARIA chat widget.

### 4. Run locally

```bash
# From project root — backend :5000, frontend :3000
npm run dev
```

Or run each service separately:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

### 5. Seed demo data (optional)

```bash
cd backend && npm run seed
```

---

## Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@demo.com` | `Admin@1234` |
| Senior Manager | `manager@demo.com` | `Manager@1234` |
| HR Recruiter | `hr@demo.com` | `HR@12345` |
| Employee | `employee@demo.com` | `Employee@1234` |

---

## Roles & Access

| Role | Access |
|------|--------|
| `super_admin` | Full system access + settings |
| `admin` | Employee management, payroll, reports |
| `senior_manager` | Team management, leave approvals, performance |
| `hr_recruiter` | Job postings, AI screening, candidate pipeline |
| `employee` | Personal dashboard, attendance, payslips, leaves |

---

## AI Features

| Feature | Description |
|---------|-------------|
| **Resume Screening** | Scores resumes 0–100 against job requirements |
| **HR Chat (ARIA)** | Floating AI assistant for HR queries (voice + text) |
| **Interview Analysis** | Analyzes transcripts for sentiment and insights |
| **Performance Insights** | AI-generated review summaries |
| **Payroll Optimization** | Tax-efficient salary structuring suggestions |

---

## Tech Stack

**Frontend:** React 18, Vite, Redux Toolkit, Tailwind CSS, Framer Motion, Recharts, Socket.io Client, React Hook Form, Zod

**Backend:** Node.js, Express, MongoDB, Mongoose, Redis, Socket.io, Google Gemini, JWT, bcrypt, Multer, Winston, Nodemailer, Bull

---

## API Endpoints

Base URL: `http://localhost:5000/api/v1`

```
POST   /auth/login
POST   /auth/register
GET    /auth/me
POST   /auth/refresh-token
POST   /auth/logout
POST   /auth/forgot-password

GET    /employees
POST   /employees
GET    /employees/:id
PUT    /employees/:id

POST   /attendance/checkin
POST   /attendance/checkout
GET    /attendance/today
GET    /attendance

GET    /payroll
POST   /payroll/process
PATCH  /payroll/:id/approve

GET    /recruitment/jobs
POST   /recruitment/jobs
POST   /recruitment/applications
GET    /recruitment/applications
PATCH  /recruitment/applications/:id/stage

POST   /ai/chat
POST   /ai/performance-insights
POST   /ai/payroll-optimize

GET    /dashboard/admin
GET    /dashboard/manager
GET    /dashboard/employee
```

---

## Docker

```bash
# Copy env vars for production (see DEPLOY.md)
docker-compose up -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:5000 |
| MongoDB | localhost:27017 |
| Redis | localhost:6379 |

---

## Production Build

```bash
npm run build
```

Frontend output: `frontend/dist/`  
Backend start: `cd backend && npm start`

See [DEPLOY.md](./DEPLOY.md) for full deployment instructions.

---

## Security

- JWT + refresh token rotation
- Redis token blacklisting
- bcrypt password hashing (12 rounds)
- Rate limiting (100 req / 15 min)
- Helmet, MongoDB sanitization, XSS protection
- Account lockout after failed login attempts
- Soft delete on records

---

## License

MIT © SmartHR Nexus 2026
