# Autofocus

Autofocus is a monorepo foundation for an information system used to manage film and photo production. The project is centered around two main processes from the documentation: `Availability Management` and `Event Management`.

## Stack

- `pnpm` workspaces
- `Vite`
- `React 18`
- `React Router`
- `Convex`
- `Vitest`

## Structure

- `apps/web` frontend application
- `packages/domain` shared domain models, statuses, and access rules
- `packages/config-typescript` shared TypeScript config
- `packages/config-eslint` shared ESLint config
- `convex` schema, auth helpers, and backend functions
- `documentation` detailed technical documentation
- `tests` basic business-rule tests

## Currently Implemented

- operational dashboard as the home page
- base pages for projects, equipment, studios, staff, events, and access control
- lighter frontend without heavy runtime logic
- Convex schema for users, projects, resources, bookings, incidents, notifications, and audit logs
- shared domain layer with statuses, access levels, and business helpers

## Running The Project

1. Install `pnpm`
2. Run `pnpm install`
3. Copy `.env.example` to `.env.local`
4. If you want frontend env vars too, copy `apps/web/.env.example` to `apps/web/.env.local`
5. Run `pnpm convex:dev`
6. Run `pnpm dev`

## Useful Commands

- `pnpm dev`
- `pnpm dev:full`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm convex:dev`
- `pnpm convex:codegen`

## Note

Dashboard, projects, equipment, studios, staff, and access management now read and write through Convex. Availability and event-management workflows can be expanded in the next iteration.
