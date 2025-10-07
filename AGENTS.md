# Repository Guidelines

## Project Structure & Module Organization
The app follows the Next.js App Router. Place routes and layouts under `src/app`, keeping server actions close to the route they serve. Shared UI primitives live in `src/components`, organized by feature. Server-side helpers and cross-cutting utilities belong in `src/lib`. Game logic and mutations should use server actions in `src/actions`. Database schema artifacts are maintained in `src/schema` alongside `drizzle.config.ts`, while static assets and icons belong in `public/`.

## Build, Test, and Development Commands
Run `pnpm install` after cloning. Use `pnpm dev` to start the development server with hot reload. Execute `pnpm build` before deploying to ensure the Next.js production bundle compiles. `pnpm start` launches the built app locally for smoke testing. Lint with `pnpm lint`; resolve warnings before committing. When changing database tables, run `pnpm push` to sync Drizzle ORM schema updates with the configured Postgres database.

## Coding Style & Naming Conventions
TypeScript is required throughout. Use PascalCase for React components and camelCase for hooks, utilities, and files in `src/lib`. Stick to functional components and keep server components async when they touch database logic. Formatting is enforced by Prettier (`prettier.config.js`) with Tailwind class sorting; run it automatically via your editor. TailwindCSS utilities drive layout—prefer composable class lists using the `cn` helper in `src/lib/utils.ts`. Avoid anonymous default exports and name components after their file.

## Testing Guidelines
Automated tests are not yet established; when introducing them, colocate `*.test.tsx` files next to the component. Use React Testing Library for UI behavior and mock server actions rather than hitting the database. Document manual QA steps in your PR until a formal test suite is in place. Add seed data scripts if tests require database state.

## Commit & Pull Request Guidelines
Commits follow a concise, present-tense style (`add metadata`, `clarify vote overwrites`). Group related changes and avoid mixing concerns. Pull requests should explain the user-visible impact, include screenshots or GIFs for UI tweaks, and reference related issues or tickets. Confirm `pnpm lint` passes and schema changes are mirrored in `src/schema` before requesting review.
