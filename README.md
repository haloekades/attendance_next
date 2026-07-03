# Attendance Next

An employee attendance and management app built with Next.js (App Router). Admins can manage employees and review attendance records; employees can clock in/out and view their own attendance history.

This frontend does not talk to a database directly — it proxies requests through its own API routes (`app/api/**`) to an external Attendance API server.

## Features

- **Auth** — cookie-based session, login/logout (`app/auth`, `lib/session.ts`).
- **Role-based routing** — admins are routed to `/admin`, employees to `/employee`, enforced by `proxy.ts` (this project's routing guard, replacing the conventional `middleware.ts`).
- **Admin**
  - Employee list with add/edit/delete (with confirmation dialog).
  - Attendance records for all employees, searchable by employee name.
  - Live notification bell when an employee updates their data (Socket.IO, see `hooks/useAdminNotifications.ts`).
- **Employee**
  - Clock in / clock out for today.
  - Personal attendance summary and profile detail.

## Requirements

- Node.js 20+
- A running instance of the upstream Attendance API server (handles `/employees`, `/attendances`, auth, etc.)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables. Create `.env.local`:

   ```bash
   API_URL=http://localhost:3000
   NEXT_PUBLIC_GATEWAY_URL=http://localhost:3000
   ```

   Set both to wherever the upstream Attendance API server is running. `NEXT_PUBLIC_GATEWAY_URL` is used client-side to open the Socket.IO connection for admin notifications, so it must be reachable from the browser (not just the Next.js server).

3. Run the dev server. Since the upstream API defaults to port `3000`, run this app on a different port to avoid a conflict:

   ```bash
   npm run dev -- -p 3001
   ```

4. Open [http://localhost:3001](http://localhost:3001) and log in.

## Project structure

```
app/
  admin/          admin dashboard pages (employees, attendances)
  employee/       employee dashboard pages (clock in/out, summary, detail)
  auth/           login page
  api/            route handlers that proxy to the upstream API (attaches the session token)
components/       client components (forms, tables, nav, dialogs)
lib/              session, types, and API helpers (getApiUrl, getAllAttendances, etc.)
proxy.ts          route guard for auth/role redirects
```

## Scripts

- `npm run dev` — start the development server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint the project
