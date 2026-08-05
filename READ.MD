<div align="center">
  <img style="width: 30%;" src="app/static/images/paws-icon.png" alt="project image">

  # **PawCare**
  PawCare is a web app that helps pet owners keep every part of their pet's care organized in one place — profiles, vaccinations, vet visits, medications, weight history, and documents — instead of relying on paper records or memory. Owners can also share a pet's profile with family members or a sitter, and ask/answer questions in a community board.

</div>

## **Live demo**

- **App:** [paw-care-lovat-psi.vercel.app](https://paw-care-lovat-psi.vercel.app)
- **API:** [pawcare-o3td.onrender.com/api](https://pawcare-o3td.onrender.com/api) — interactive docs at `/api/docs/`

Both are hosted on free tiers. The backend spins down after inactivity, so the first request after idle time can take up to ~50 seconds to wake up.

## **Tech stack**

- **Backend:** Django 5 + Django REST Framework, JWT auth (`simplejwt`)
- **Database:** PostgreSQL in production, SQLite for local development
- **Frontend:** React (Vite) + Tailwind CSS, consuming the Django REST API
- **Testing:** Django's test runner / pytest-django (backend), Vitest + Testing Library (frontend)
- **Deployment:** Render (Django API, Gunicorn, WhiteNoise for static files, free web service + free PostgreSQL) and Vercel (React frontend)

## **Key features**

1. **Pet profiles** — name, species, breed, allergies, personality, daily routine, and care instructions, with a photo. Printable one-page profile view.
2. **Vaccination tracking** — log vaccines given and upcoming due dates; overdue ones are flagged, and completed ones can be marked done.
3. **Vet visit history** — reason, vet name, notes, and an optional follow-up date/task that can be marked complete.
4. **Medications** — recurring dosing schedules (daily, weekly, as-needed, etc.) with active/inactive status.
5. **Weight tracking** — log weight over time and view it on a chart.
6. **Documents** — upload lab results, vet reports, and insurance documents per pet.
7. **Dashboard reminders** — a single view of everything due or overdue across all of a user's pets.
8. **Shared access** — pet owners can grant a family member or sitter view-only or edit access to a pet's profile.
9. **Community board** — public Q&A style posts and comments, searchable by title.

## **Local development**

### Backend (Django API)

```bash
python -m venv venv
venv\Scripts\Activate.ps1      # Windows PowerShell; use venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env           # fill in SECRET_KEY, etc.
python manage.py migrate
python manage.py runserver
```

API runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/api/docs/`.

### Frontend (React)

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs at `http://localhost:5173` and talks to the Django API above. Both servers need to be running for the React app to load data.

### Running tests

```bash
# Backend
python manage.py test

# Frontend
cd frontend
npm run test
```

### Old server-rendered UI

The original Django template views (`/pets/`, `/vaccinations/`, etc.) still work and are served from the same `runserver` process — useful during the transition to the React frontend, but the React app is the primary UI going forward.

## **Deployment notes**

- Backend env vars (Render): `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, `DATABASE_URL` (auto-provided by Render's Postgres add-on).
- Frontend env var (Vercel): `VITE_API_URL` — set at build time, pointing at the deployed API's `/api` path.
- Media uploads (pet photos, documents) are currently stored on Render's local disk, which is **ephemeral** — files can be lost on redeploy. Moving to persistent object storage (e.g. S3-compatible storage) is a known follow-up before relying on this for real long-term data.
