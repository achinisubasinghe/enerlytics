# Enerlytics

Enerlytics is a modern Utility Management and Analytics Platform built with Next.js, MySQL, and Tailwind CSS. It delivers tailored, role-based workflows for utility administrators, operational staff, meter readers, cashiers, management executives, and end customers.

> [!NOTE]
> Enerlytics uses JWT-based authentication coupled with granular Role-Based Access Control (RBAC) to enforce security and access boundaries across all API endpoints and application routes.

---

## Features

### Role-Based Portals & Workflows

- **Admin Portal**: Complete system administration, user account management, and security audit logs.
- **Administrative Staff**: Customer onboarding, meter inventory management, reader assignments, tariff structure updates, and complaint ticket management.
- **Meter Reader Portal**: Fast, mobile-friendly interface for recording meter readings and reviewing historical reading logs.
- **Billing & Cashier Portal**: Invoicing, outstanding balance tracking, payment processing, payment history, and financial summaries.
- **Manager Dashboard**: High-level analytical dashboards tracking consumption trends, revenue streams, top utility consumers, and payment defaulters.
- **Customer Self-Service**: Usage monitoring, bill viewing, online payment initiation, and support ticket submittal.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Frontend & UI**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Database**: [MySQL](https://www.mysql.com/) (via `mysql2`)
- **Security & Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`

---

## Getting Started

### Prerequisites

Ensure the following tools are installed on your environment:

- **Node.js**: `v18.x` or higher
- **Package Manager**: `npm`, `pnpm`, or `bun`
- **MySQL Database**: `v8.0` or higher

### Environment Setup

Create a `.env.local` file in the root directory and configure your environment variables:

```env
# Database Settings
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=utility_management_system

# Authentication Secret
JWT_SECRET=your_secure_jwt_secret_key
```

> [!IMPORTANT]
> Verify that your MySQL instance is running and the database specified in `DB_NAME` has been initialized before launching the development server.

### Installation & Run Commands

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Access the web application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
enerlytics/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router pages and API routes
│   │   ├── api/            # RBAC-protected API endpoints
│   │   ├── dashboard/      # Role-specific dashboard layouts and views
│   │   ├── login/          # User authentication UI
│   │   └── register/       # User registration UI
│   ├── components/         # Global navigation & reusable UI components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Database connection, auth utilities, RBAC rules
├── middleware.js           # Route protection & JWT verification middleware
├── package.json
└── next.config.mjs
```

---

## Access Control Matrix

| Role | Responsibilities | Scope |
| --- | --- | --- |
| **ADMIN** | User lifecycle, system logs | Full system access |
| **ADMIN_STAFF** | Customers, meters, tariffs, complaints | Operational management |
| **METER_READER** | Reading submissions | Assigned meters |
| **CASHIER** | Invoicing, payments, debt status | Billing & cash collection |
| **MANAGER** | Business analytics & revenue reporting | Read-only analytics |
| **CUSTOMER** | Account management, bill tracking, complaints | Personal self-service |

> [!TIP]
> Authorization is enforced both client-side via layout navigation guards and server-side through `middleware.js` and `src/lib/rbac.js`.

---

## Available Scripts

In the project directory, you can run:

- `npm run dev` – Runs the app in development mode at `http://localhost:3000`.
- `npm run build` – Builds the app for production.
- `npm run start` – Starts the production build server.
