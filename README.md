# Notes SaaS App

Multi-tenant Notes app supporting **Acme** & **Globex** tenants with **Admin** and **Member** roles.

---

## Multi-Tenancy
Shared schema using `tenantId` for strict isolation.

---

## Authentication
JWT-based login stored in `localStorage`.

---

## Roles

- **Admin** → invite users, upgrade plan  
- **Member** → create/view/edit/delete notes

---

## Predefined Accounts

- **Acme Tenant:** `admin@acme.test`, `user@acme.test`  
- **Globex Tenant:** `admin@globex.test`, `user@globex.test`

---

## Subscription

- **Free** → max 3 notes  
- **Pro** → unlimited notes

---

## Upgrade
```http
POST /api/tenants/:slug/upgrade
