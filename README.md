# EduFlow Admin

A modern educational administration dashboard for managing courses, instructors, and institutional data. Built with Angular and NgRx, it demonstrates reusable UI patterns (table, filters, dialogs, toasts), client-side and server-side data handling, and a complete authentication flow with route guards.

## Short Description

EduFlow Admin is a single-page application that lets administrators browse a dashboard, manage courses and instructors, configure settings, and authenticate securely. Data is loaded from local JSON files (mock API), with optional persistence in the browser via Local Storage for authentication and user registration.

## Technologies Used

| Category | Stack |
|----------|--------|
| Framework | Angular 21 (standalone components, signals) |
| State Management | NgRx Store, Effects, Selectors |
| UI Library | PrimeNG 21, PrimeIcons, Aura theme |
| Styling | SCSS, CSS custom properties (light/dark themes) |
| HTTP | Angular `HttpClient` (JSON mock data) |
| Tooling | Angular CLI, TypeScript 5.9, Vitest |

## Features Implemented

### Authentication
- Sign in and sign up with NgRx auth store
- Users loaded from `users.json` plus sign-up accounts saved in Local Storage
- Encrypted session storage when **Remember this device** is checked
- Route guards: dashboard routes require login; auth pages redirect logged-in users
- Sign up creates an account then redirects to sign in (no auto-login)
- Logout from sidebar footer with toast feedback

### Dashboard
- KPI cards and breakdowns derived live from courses and instructors store
- Recent courses and top instructors lists
- Links to course detail and list pages

### Courses
- List with search, status/category filters, and advanced logical filters (AND/OR)
- Client-side pagination, sorting, and filtering
- Add / edit / delete via dynamic dialogs with validation
- Course detail page (view from table name or row action)
- Created and updated date columns

### Instructors
- List with search, department, status, and date filters
- Advanced logical filters
- Server-side pagination and sorting (simulated via NgRx effects + delay)
- Add / edit / delete with toast notifications
- Course count computed from courses store (not stored on instructor)

### Shared UI
- Reusable `app-table`, `app-filters`, confirmation dialog, advanced filter dialog
- Custom toast service (bottom-end notifications)
- Theme toggle (light / dark)
- Loading, empty, and error states on tables

### Other Pages
- Settings (profile UI)
- Auth marketing pages (SSO portal, Azure AD, privacy, terms, support)

## How to Run the Project

### Prerequisites

- **Node.js** 20+ recommended
- **npm** 11+ (project uses `packageManager: npm@11.11.0`)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd EDU_Courses_Task

# Install dependencies (node_modules is not committed)
npm install
```

### Development Server

```bash
npm start
# or: ng serve
```

Open **http://localhost:4200/** in your browser.

### Production Build

```bash
npm run build
```

Output is written to `dist/EDU_Courses_Task/`.

### Demo Login Credentials

| Email | Password |
|-------|----------|
| `admin@eduflow.edu` | `Admin@123456` |
| `alex.rivera@eduflow.edu` | `Rivera@123456` |

New accounts can be created via **Sign Up**; after registration you are redirected to sign in.

## Mock API / Local Storage Explanation

### Mock API (JSON files)

There is no real backend. `DataService` loads data over HTTP from static JSON under `public/assets/data/`:

| File | Purpose |
|------|---------|
| `courses.json` | Course catalog (CRUD updates in-memory via NgRx) |
| `instructors.json` | Instructor records |
| `users.json` | Seed accounts for authentication |

On first load, NgRx effects fetch JSON via `HttpClient`. Create/update/delete operations update the **NgRx store** in memory. Changes to courses/instructors are **not** written back to JSON files (refresh resets to seed data except auth users — see below).

**Simulated server behavior (instructors):** `InstructorsEffects` uses `timer(600–800ms)` before returning filtered/paginated/sorted data to mimic API latency.

**Client-side behavior (courses):** Filtering, sorting, and pagination run in selectors without a network round-trip.

### Local Storage

| Key | Description |
|-----|-------------|
| `eduflow_auth_session` | Encrypted email/password session when user checks **Remember this device** on sign in. Restored on app init if credentials still match a known user. |
| `eduflow_registered_users` | Users created via sign up (merged with `users.json` on load). |

Encryption uses a lightweight XOR + Base64 scheme in `auth-crypto.util.ts` (demo obfuscation, not production-grade cryptography).

**Logout** clears `eduflow_auth_session`.

### Repository Notes

- **`node_modules` is excluded** via `.gitignore` — run `npm install` after cloning.
- **Full source code** is under `src/` and `public/`.
- **Screenshots** (optional): add to a `docs/screenshots/` folder and link here if desired.
- **Live demo** (optional): deploy `dist/EDU_Courses_Task` to GitHub Pages, Netlify, or Vercel and add the URL below.

<!-- Optional: Live Demo -->
<!-- **Live Demo:** https://your-demo-url.example.com -->

## Project Structure (Overview)

```
src/app/
├── core/           # Guards, services (data, auth storage, theme), models, utils
├── features/
│   ├── auth/       # Sign in/up, NgRx auth store
│   ├── courses/    # List, detail, forms, store
│   ├── instructors/# List, forms, store
│   ├── dashboard/  # Analytics selectors + page
│   └── settings/
├── layouts/        # Auth and dashboard shells
└── shared/         # Table, filters, toaster, sidebar, header, dialogs
public/assets/data/ # Mock JSON data
```

## Assumptions

- Demo passwords are stored in plain text in JSON / Local Storage for evaluation only.
- Course and instructor mutations persist only in memory during the session (except auth users in Local Storage).
- Instructor “server-side” behavior is simulated in the browser with NgRx effects, not a real REST API.
- Email is used as the login username.
- A single admin session is supported (no roles/permissions enforcement beyond UI labels).

## Bonus Features

- **Advanced logical filters** dialog with AND/OR rules on courses and instructors
- **Dual sorting strategies**: client-side (courses) vs server-side simulation (instructors)
- **Course detail** page with back navigation
- **Store-driven dashboard** with status/category breakdowns
- **Custom global toaster** with success/error/info/warn severities
- **Encrypted remember-me** session in Local Storage
- **Dark / light theme** toggle
- **Dynamic PrimeNG dialogs** for forms and confirmations
- **Table row actions** menu, clickable course names, skeleton loading states

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server at `http://localhost:4200` |
| `npm run build` | Production build |
| `npm test` | Unit tests (Vitest) |
| `npm run watch` | Development build with watch mode |

## License

This project was created as a technical assessment / educational task.
