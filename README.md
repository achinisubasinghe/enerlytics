# Enerlytics

Enerlytics is a utility management and analytics platform built with Next.js (TypeScript), MySQL, and Tailwind CSS. It provides role-based workflows for administrators, operational staff, meter readers, cashiers, managers, and customers.

## Features

- **Admin**: user management and system overview
- **Administrative Staff**: customers, meters, meter-reader assignments, tariffs, complaints
- **Meter Reader**: assigned meters, readings, history (auto bill generation)
- **Billing / Cashier**: bills, outstanding balances, payments, summary
- **Manager**: consumption, revenue, payments, defaulters, top consumers
- **Customer**: bills, meters, complaints

## Tech Stack

- Next.js (App Router) + TypeScript
- React, Tailwind CSS, shadcn/ui, Lucide, Framer Motion, Recharts
- MySQL via `mysql2`
- JWT auth (`jsonwebtoken`) + `bcryptjs`

## Setup

### Prerequisites

- Bun
- MySQL 8+

### Environment

Create `.env.local`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=utility_management_system
JWT_SECRET=your_secure_jwt_secret_key
```

### Install & run

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `bun run dev` – development server
- `bun run build` – production build
- `bun run start` – start production server

## Access control

| Role | Scope |
| --- | --- |
| ADMIN | Full system access |
| ADMIN_STAFF | Customers, meters, tariffs, complaints |
| METER_READER | Assigned meters / readings |
| CASHIER | Bills and payments |
| MANAGER | Read-only analytics |
| CUSTOMER | Own bills, meters, complaints |

Route protection uses `proxy.ts` (Next.js 16) with JWT cookie verification and RBAC from `src/lib/rbac.ts`.
