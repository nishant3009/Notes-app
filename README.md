Notes SaaS App

Multi-tenant Notes app supporting Acme & Globex tenants with Admin and Member roles.

Multi-Tenancy: Shared schema using tenantId for strict isolation.

Authentication: JWT-based login stored in localStorage.

Roles:

Admin → invite users, upgrade plan

Member → create/view/edit/delete notes

Predefined accounts:

admin@acme.test
, user@acme.test

admin@globex.test
, user@globex.test

Subscription:

Free → max 3 notes

Pro → unlimited notes

Upgrade: POST /api/tenants/:slug/upgrade

Notes API: CRUD via /api/notes endpoints.

Deployment: Hosted on Vercel, health check at /api/health.

Tech Stack: Next.js, React, Tailwind CSS, Node.js, JWT, MongoDB