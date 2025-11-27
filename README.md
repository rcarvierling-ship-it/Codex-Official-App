# The Official App 🏀

> All-in-one sports operations platform for managing events, officials, and team coordination

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4.24-green)](https://next-auth.js.org/)

## Overview

The Official App is a comprehensive platform designed to streamline sports operations management. It provides role-based dashboards, real-time event management, official assignments, team coordination, and built-in communication tools for athletic directors, coaches, officials, and administrators.

## ✨ Features

### Core Capabilities
- **Real-time Event Management** - Create, reschedule, and broadcast updates across teams
- **Role-Based Access Control** - Granular permissions for different user roles
- **Instant Official Assignments** - Match officials based on availability, certifications, and distance
- **Built-in Communication** - Send announcements, confirmations, and alerts
- **Team Coordination** - Manage rosters, staff, and logistics across multiple schools/leagues
- **Developer Tools** - APIs, webhooks, and sandbox data for integrations

### User Roles
- **League Admin** (`league_admin`) - Highest level access, can see all schools/leagues
- **School Admin** (`school_admin`) - School-level administration
- **Athletic Director** (`athletic_director`) - School athletic program management
- **Coach** (`coach`) - Team and event management
- **Official** (`official`) - Referee/official availability and assignments
- **Fan** (`fan`) - View events, standings, and announcements (default role)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- PostgreSQL database (Vercel Postgres recommended)
- Environment variables configured (see [Environment Variables](#environment-variables))

### Installation

```bash
# Clone the repository
git clone https://github.com/rcarvierling-ship-it/Codex-Official-App.git
cd Codex-Official-App

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run database migrations (if needed)
pnpm db:migrate

# Seed the database (optional)
pnpm db:seed

# Start development server
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
Codex-Official-App/
├── app/                    # Next.js App Router pages
│   ├── (app)/             # Protected application routes
│   │   ├── dashboard/     # Role-specific dashboards
│   │   ├── events/        # Event management
│   │   ├── admin/        # Admin panels
│   │   └── ...
│   ├── (auth)/           # Authentication pages
│   ├── api/              # API routes
│   ├── demo/             # Demo mode (mock data)
│   └── onboarding/       # User onboarding flow
├── lib/                   # Shared utilities and helpers
│   ├── auth.ts           # NextAuth configuration
│   ├── auth-helpers.ts   # Authentication helpers
│   ├── types/            # TypeScript type definitions
│   └── repos/            # Database repositories
├── components/           # React components
├── src/                  # Additional source files
└── public/              # Static assets
```

## 🔐 Authentication & Authorization

The app uses [NextAuth.js](https://next-auth.js.org/) for authentication with role-based access control.

### Authentication Flow
1. Users sign up → Default role: `fan`
2. Users complete onboarding → Select school and role
3. Users are redirected to their role-specific dashboard
4. Middleware protects routes based on authentication
5. Pages use `requireAuth()`, `requireRole()`, or `getAuthRole()` for access control

### Role-Based Dashboards
- `/dashboard/league` - League Admin Dashboard
- `/dashboard/school` - School Admin & Athletic Director Dashboard
- `/dashboard/coach` - Coach Dashboard
- `/dashboard/official` - Official Dashboard
- `/dashboard/fan` - Fan Dashboard

### Using Authentication Helpers

```typescript
import { requireAuth, requireRole, getAuthRole } from "@/lib/auth-helpers";
import type { SessionUser } from "@/lib/types/auth";

// Require authentication
const session = await requireAuth();
const user = session.user as SessionUser;

// Require specific role
const { session, role } = await requireRole("league_admin");

// Get current role
const role = await getAuthRole();
```

## 🌍 Environment Variables

Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Database (Vercel Postgres recommended)
POSTGRES_URL=your-postgres-connection-string
POSTGRES_URL_NON_POOLING=your-non-pooling-connection-string
# or
DATABASE_URL=your-database-url

# Optional: Owner email for owner-only routes
OWNER_EMAIL=owner@example.com

# Optional: Vercel Blob Storage (for file uploads)
BLOB_READ_WRITE_TOKEN=your-blob-token

# Optional: Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### Required for Production
- `NEXTAUTH_SECRET` - Secret key for NextAuth.js sessions
- `POSTGRES_URL` or `DATABASE_URL` - Database connection string

## 🗄️ Database

The app uses PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/) for type-safe database queries.

### Database Setup

1. **Create a PostgreSQL database** (Vercel Postgres recommended)
2. **Run migrations:**
   ```bash
   pnpm db:migrate
   ```
3. **Seed the database (optional):**
   ```bash
   pnpm db:seed
   ```

### Database Schema

Key tables:
- `users` - User accounts and authentication
- `schools` - School/organization information
- `leagues` - League/association information
- `events` - Sports events and games
- `teams` - Team information
- `assignments` - Official assignments to events
- `requests` - Official work requests
- `user_school_roles` - User role assignments per school/league

See `setup-neon-tables.sql` for the complete schema.

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking

# Database
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
```

## 🧪 Testing

### Demo Mode
The app includes a demo mode (`/demo`) that uses mock data stored in browser sessionStorage. This is useful for:
- UI/UX development and testing
- Sharing with stakeholders
- Testing without database setup

### Test Hub
Access the test hub at `/test` to:
- View real database data
- Create/update records
- Test CRUD operations
- Verify schema compatibility

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

The app is optimized for deployment on [Vercel](https://vercel.com/), which provides:
- Automatic deployments from Git
- Serverless functions
- Edge network
- Built-in PostgreSQL integration

## 📚 Documentation

- **[APP_STRUCTURE.md](./APP_STRUCTURE.md)** - Detailed application structure guide
- **[MIGRATION_GUIDE_SESSIONUSER.md](./MIGRATION_GUIDE_SESSIONUSER.md)** - Guide for migrating to SessionUser type
- **[AUTH_FIXES_SUMMARY.md](./AUTH_FIXES_SUMMARY.md)** - Authentication system documentation
- **[PRODUCTION_SAFETY_SUMMARY.md](./PRODUCTION_SAFETY_SUMMARY.md)** - Production deployment guide

## 🔧 Development

### Type Safety
The app uses TypeScript with strict type checking. For type-safe session access, use the `SessionUser` interface:

```typescript
import type { SessionUser } from "@/lib/types/auth";

const user = session.user as SessionUser;
// Now you have full type safety and autocomplete
```

### Code Style
- ESLint for code linting
- Prettier for code formatting (if configured)
- TypeScript strict mode enabled

### Adding New Features
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following existing patterns
3. Test thoroughly
4. Submit pull request

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review the codebase structure

## 🎯 Roadmap

- [ ] Enhanced error boundaries
- [ ] Comprehensive test suite
- [ ] Additional API integrations
- [ ] Mobile app support
- [ ] Advanced analytics and reporting

---

**Built with ❤️ using Next.js, TypeScript, and NextAuth.js**
