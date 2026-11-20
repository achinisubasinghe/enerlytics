# Enerlytics

Enerlytics is a utility billing, meter reading, and analytics platform built with Next.js 16, Drizzle ORM, and MySQL. It separates workflows across six roles covering system administration, customer and meter management, field meter readings, cashier payments, executive analytics, and customer self-service.

## Features

- **System administration.** Manage staff and customer user accounts and inspect system metrics under `/dashboard/admin`.
- **Administrative staff operations.** Register customers and meters, assign meter readers, configure slab-based tariffs, and handle customer complaints under `/dashboard/admin-staff`.
- **Meter reading and automatic billing.** Record readings for assigned meters and generate bills automatically from active tariff slabs under `/dashboard/meter-reader`.
- **Billing and cashier workflows.** Review generated bills, track outstanding balances, record payments, and inspect payment history under `/dashboard/billing`.
- **Manager analytics.** View consumption trends, revenue breakdowns, payment collections, defaulter lists, and top consumers with Recharts under `/dashboard/manager`.
- **Customer portal.** View personal meters, inspect bills, and submit or track complaints under `/dashboard/customer`.
- **Cookie-based JWT access control.** `proxy.ts` and `src/lib/rbac.ts` verify JWT cookies and enforce role permissions on every dashboard and API route.

## Tech stack

- [Next.js](https://nextjs.org) 16 App Router and [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org) 7
- [Tailwind CSS](https://tailwindcss.com) 4, Radix UI primitives, Lucide icons, and Recharts
- MySQL 8 with `mysql2` and [Drizzle ORM](https://orm.drizzle.team)
- JWT authentication via `jsonwebtoken` and password hashing via `bcryptjs`
- [Bun](https://bun.sh)

## Getting started

### Prerequisites

- [Bun](https://bun.sh) 1.3 or later
- MySQL 8 or a compatible MariaDB server

### Environment variables

Create `.env.local` in the project root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=utility_management_system
JWT_SECRET=your_secure_jwt_secret_key
```

### Install and run

```bash
git clone https://github.com/achinisubasinghe/enerlytics.git
cd enerlytics
bun install
bun run db:migrate
bun run db:seed
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seeded accounts

`bun run db:seed` resets database tables and creates six demo accounts that all use the password `password123`:

| Email | Role | Scope |
| --- | --- | --- |
| `admin@enerlytics.com` | `ADMIN` | User management and system overview |
| `staff@enerlytics.com` | `ADMIN_STAFF` | Customers, meters, reader assignments, tariffs, and complaints |
| `reader@enerlytics.com` | `METER_READER` | Assigned meters and reading submissions |
| `cashier@enerlytics.com` | `CASHIER` | Bills, outstanding balances, and payments |
| `manager@enerlytics.com` | `MANAGER` | Read-only consumption, revenue, and defaulter analytics |
| `customer@enerlytics.com` | `CUSTOMER` | Personal bills, meters, and complaints |

## Scripts

| Command | Behavior |
| --- | --- |
| `bun run dev` | Start the Next.js development server |
| `bun run build` | Build the production bundle |
| `bun run start` | Start the production server |
| `bun run lint` | Run ESLint |
| `bun run db:generate` | Generate Drizzle SQL migrations from `src/db/schema.ts` |
| `bun run db:migrate` | Apply pending database migrations |
| `bun run db:seed` | Reset tables and seed demo accounts, meters, tariffs, and bills |
| `bun run db:studio` | Launch Drizzle Studio |

## Project structure

```text
enerlytics/
├── drizzle/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   ├── admin-staff/
│   │   │   ├── billing/
│   │   │   ├── customer/
│   │   │   ├── manager/
│   │   │   └── meter-reader/
│   │   ├── login/
│   │   ├── register/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── global/
│   │   ├── layout/
│   │   └── ui/
│   ├── db/
│   │   ├── index.ts
│   │   ├── migrate.ts
│   │   ├── schema.ts
│   │   └── seed.ts
│   └── lib/
│       ├── auth.ts
│       ├── db.ts
│       └── rbac.ts
├── drizzle.config.ts
├── next.config.ts
├── package.json
├── proxy.ts
└── tsconfig.json
```
