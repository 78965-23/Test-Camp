# CertifyHub – Certificate Management System

A full‑stack web application for applying, tracking, and managing certificates with a glass‑morphism UI.

## Features
- Apply for certificates (Academic, Professional, Community, Training) with dynamic forms.
- Auto‑generated Reference Number and receipt PDF (with progress bar).
- Track application status using Reference Number.
- Download official certificate PDF (if approved).
- Admin dashboard (login: `08092003`) with stats, search, filter, view, review, approve/reject.
- Fade‑in scroll animations on homepage.
- Mobile‑friendly hamburger menu.

## Deployment on Render (Free)
1. Push repository to GitHub.
2. On Render: **New Web Service** → Connect your GitHub repo.
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add a **Persistent Disk** with mount path `/data`.
6. Deploy. Your app will be live at `https://your-app.onrender.com`.

## Local Development
```bash
npm install
npm start
