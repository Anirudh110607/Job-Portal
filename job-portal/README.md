# ⚡ HirePulse - Production-Ready Full Stack Job Portal Web Application

HirePulse is a modern, scalable, responsive, and feature-rich **Job Portal Application** designed to connect tech candidates, recruiters, and platform administrators. Built with a production-grade architecture inspired by LinkedIn Jobs and Indeed.

---

## 🌟 Key Features

### 🔐 Authentication & Security
- **Multi-Role RBAC**: Dedicated dashboards & permissions for **Candidates**, **Recruiters / Employers**, and **Admins**.
- **JWT & Password Hashing**: Access tokens, refresh tokens, and `bcryptjs` password encryption.
- **Security Middleware**: Express Rate-Limiting, Helmet headers, CORS policies, sanitization.

### 💼 Candidate Features
- **Debounced Job Search & Multi-Filters**: Instant keyword filtering by category, workplace type (Remote/Hybrid/On-site), employment type, and experience level.
- **1-Click Quick Application**: Instant cover letter & resume link submission with celebratory confetti animation.
- **Candidate Profile Editor**: Bio, skills pills, experience, education, portfolio, GitHub, LinkedIn, availability, and PDF resume upload.
- **Saved Bookmarks & Applications Pipeline**: Track active applications with status badges (`Applied`, `Shortlisted`, `Interview`, `Hired`, `Rejected`).
- **🤖 AI Resume Analyzer & ATS Checker**: Powered by AI algorithm to analyze resume keywords, calculate ATS score (0-100%), and provide actionable feedback.

### 🏢 Recruiter & Employer Features
- **Job Management**: Create, edit, duplicate, close, and delete job listings.
- **Candidate Pipeline**: Inspect candidate match percentage, view detailed candidate profiles, and update status.
- **📅 Interview Scheduler**: Schedule Google Meet / Zoom interviews directly onto candidate dashboard calendar timelines.
- **Company Profile Manager**: Manage company logo, cover banner, description, size, and industry.

### 🛡️ Admin Dashboard
- **Platform Analytics**: Total users, candidates, recruiters, active listings, application rates.
- **User Moderation**: Suspend / Ban problematic accounts with 1 click.
- **Moderation Console**: Delete fake job postings and approve recruiter organizations.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Axios, React Router DOM v6, Canvas Confetti.
- **Backend**: Node.js, Express.js, MongoDB with Mongoose (with dual-layer resilient in-memory fallback).
- **Authentication**: JWT (JSON Web Tokens), bcryptjs.
- **Deployment Ready**: Standardized for Vercel (Frontend) and Render (Backend).

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### 1. Installation

#### Clone & Set Up Server:
```bash
cd server
npm install
```

#### Set Up Client:
```bash
cd ../client
npm install
```

---

### 2. Running Locally

#### Start Backend Server:
```bash
cd server
npm run dev
```
> The API server will launch at `http://localhost:5000`. Demo data is automatically pre-seeded.

#### Start Frontend Client:
```bash
cd client
npm run dev
```
> The React app will open at `http://localhost:5173`.

---

## 🔑 Demo Test Credentials

To test the application immediately, click the **Quick Demo Login** buttons on the Login page or use the credentials below (Password for all accounts: `Password123!`):

| Role | Email | Features to Test |
| :--- | :--- | :--- |
| **Candidate** | `candidate1@gmail.com` | Job search, 1-Click apply, AI Resume Checker, Saved Jobs, Interview schedule |
| **Recruiter** | `recruiter@techcorp.com` | Post job, view candidates, schedule interview with Google Meet link |
| **Admin** | `admin@hirepulse.com` | System stats, user moderation table, suspend/unban accounts |

---

## 📡 API Endpoint Summary

### Auth APIs
- `POST /api/auth/register` - Register Candidate or Recruiter
- `POST /api/auth/login` - Authenticate & return JWT
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update candidate profile & resume

### Job APIs
- `GET /api/jobs` - Search & filter jobs (Query, Category, WorkplaceType, JobType, Page)
- `GET /api/jobs/:id` - Job details & similar jobs
- `POST /api/jobs` - Create new job (Recruiter/Admin)
- `DELETE /api/jobs/:id` - Remove job listing

### Application & Interview APIs
- `POST /api/applications/apply` - Submit job application
- `GET /api/applications/my-applications` - Candidate application list
- `PUT /api/applications/:id/status` - Recruiter update application status
- `POST /api/interviews/schedule` - Schedule candidate interview

### AI Tools
- `POST /api/ai/analyze-resume` - Run ATS Resume Score Analysis

---

## 📄 License
This project is licensed under the MIT License - open for portfolio demonstration and full-stack developer applications.
