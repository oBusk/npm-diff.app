# Copilot Instructions for npm-diff.app

## Repository Overview

**npm-diff.app** is a Next.js web application that allows users to inspect and compare changes between different versions of npm packages. It provides a visual diff interface powered by React, displaying file changes, bundle size comparisons, and package metadata.

- **Project Type**: Next.js 16 (App Router) web application
- **Size**: ~182 TypeScript/TSX files, ~6,600 lines of code in `src/`
- **Languages/Frameworks**: TypeScript, React 19, Next.js 16 (Turbopack), Tailwind CSS
- **Target Runtime**: Node.js 24.x
- **Package Manager**: pnpm 10.26.0 (required - do not use npm or yarn)
- **Deployment**: Vercel (automatic deployment on push to main)

## Required Tools & Versions

- **Node.js**: 24.x (package.json specifies this; warnings appear with older versions but Node 20.x works for development)
- **pnpm**: 10.26.0 (exact version specified in packageManager field)
- Environment setup is handled automatically in CI and Copilot environments

## Next.js MCP Integration

This repository uses the Next.js MCP (Model Context Protocol) server for enhanced development tooling. The MCP server provides coding agents with real-time access to your Next.js application.

### Capabilities

The `next-devtools-mcp` server provides:

- **Error Detection**: Retrieve current build errors, runtime errors, and type errors from dev server
- **Live State Queries**: Access real-time application state and runtime information
- **Page Metadata**: Query page routes, components, and rendering details
- **Server Actions**: Inspect Server Actions and component hierarchies
- **Development Logs**: Access development server logs and console output
- **Next.js Knowledge Base**: Query comprehensive Next.js documentation and best practices
- **Browser Testing**: Playwright MCP integration for verifying pages

### Using MCP with Agents

Agents can automatically discover and connect to your Next.js development server through MCP. This enables agents to:

- Make context-aware suggestions based on your App Router structure
- Query live application state and current configuration
- Understand your page and layout hierarchy
- Provide accurate implementations following your project's patterns
- Detect and diagnose errors in real-time
- Access Next.js best practices and documentation

## Build & Validation Commands

**All commands use pnpm** - dependencies are installed automatically in Copilot environments.

### CI Validation Commands

These commands must pass for CI to succeed (run in this order):

1. **Linting** (timeout: 5 minutes in CI):

    ```bash
    pnpm run lint
    ```

    - Runs ESLint on all TypeScript/JavaScript files
    - Automatically runs `pnpm run prettier` afterward (via postlint hook)
    - **Fix issues**: `pnpm run lint-fix` (also runs prettier-fix)

2. **Tests** (timeout: 5 minutes in CI):

    ```bash
    pnpm run test-ci
    ```

    - Runs Jest tests in CI mode (non-watch)
    - 10 test suites, 98 tests (as of current state)
    - Takes ~2-3 seconds
    - **Development mode**: `pnpm run test` (watch mode)

3. **Type Checking** (timeout: 5 minutes in CI):

    ```bash
    pnpm run typecheck
    ```

    - Runs TypeScript compiler without emitting files
    - Takes ~5-10 seconds
    - Uses TypeScript 5.9.3 with strict mode enabled

4. **Build** (timeout: 5 minutes in CI):

    ```bash
    pnpm run build
    ```

    - Runs Next.js production build with Turbopack
    - Takes ~10-15 seconds (first build), ~6-8 seconds (cached)
    - Generates static pages for `/`, `/about`, `/about/api`
    - Dynamic routes: `/[...parts]`, `/api/-/versions`, `/api/[...parts]`
    - Output directory: `.next/` (gitignored)

### Development Server

```bash
pnpm run dev
```

- Starts Next.js dev server on `http://localhost:3000`
- Ready in ~450ms after first startup
- Uses Turbopack for fast refresh

### Other Commands

- `pnpm run start`: Runs production server (requires `pnpm run build` first)
- `pnpm run prettier`: Check formatting for markdown, YAML, JSON files
- `pnpm run prettier-fix`: Auto-fix formatting issues
- `pnpm run lint-staged`: Run pre-commit checks (ESLint + Prettier on staged files)

## Project Structure

### Main Directories

- **`src/app/`** - Next.js App Router pages, layouts, and API routes
- **`src/components/`** - Shared React components and UI primitives
- **`src/lib/`** - Utility libraries (API clients, diff parsing, query handling)
- **`public/`** - Static assets (icons, manifest)
- **`.github/workflows/`** - CI/CD pipelines

### Organizational Patterns

**Underscore-prefixed directories** (`_page`, `_layout`): Used for grouping related components within a route directory. These are not part of the URL structure.

Example:

```
src/app/[...parts]/
  ├── _page/              # Components used by page.tsx
  │   ├── DiffIntro/
  │   ├── NpmDiff/
  │   └── SizeComparison/
  └── page.tsx            # Route page
```

**API route prefixing**: API routes under `src/app/api/-/` use a `-` prefix to avoid conflicts with the catch-all `[...parts]` route. See `src/app/api/-/README.md` for details.

### Key Configuration Files

- **tsconfig.json**: Path alias `^/*` maps to `src/*` (use this in imports)
- **next.config.js**: Configures server external packages (`libnpmdiff`, `npm-package-arg`, `pacote`)
- **eslint.config.mjs**: ESLint configuration with Next.js rules
- **jest.config.js**: Jest configuration for Next.js with jsdom environment
- **.editorconfig**: 4-space indentation, LF line endings, 80-char line length

### Generated Files

**Do not commit changes to `next-env.d.ts`** - this file is auto-generated by Next.js and should not be manually edited or committed.

### Import Paths

**Always use the `^/` alias for imports from `src/`:**

```typescript
import { something } from "^/lib/utils"; // Correct
import { something } from "@/lib/utils"; // Wrong - @ not configured
import { something } from "../../../lib/utils"; // Avoid - use alias
```

## Common Issues & Workarounds

### Node Version Warning

```
WARN Unsupported engine: wanted: {"node":"24.x"} (current: {"node":"v20.19.6","pnpm":"10.26.0"})
```

**Safe to ignore** - the project works with Node 20.x, but CI uses Node 24.x. Tests, builds, and all commands work fine.

### Clean Build

If builds are failing or you see stale type errors:

```bash
rm -rf .next
pnpm run build
```

The `.next/` directory is auto-generated and can be safely deleted.

### Git Hooks

Pre-commit hooks are automatically installed via `simple-git-hooks` during `pnpm install`. They run `pnpm run lint-staged` which:

- Runs `eslint --fix` on staged TS/TSX/JS/JSX files
- Runs `prettier --write` on staged MD/YAML/JSON files

### Test File Pattern

Tests are colocated with source files using `.test.ts` or `.test.tsx` extensions. When adding tests:

- Place them next to the file they test (e.g., `utils.ts` → `utils.test.ts`)
- Use `@testing-library/react` for component tests
- Use `@testing-library/jest-dom` matchers (e.g., `toBeInTheDocument`)

### Vercel Deployment

The app is deployed to Vercel automatically. No build configuration needed - Vercel auto-detects Next.js and uses the correct build command.

## Architecture Notes

### API Route Structure

API routes use a special `-` prefix to avoid conflicts with the catch-all `[...parts]` route:

- `/api/-/versions` - Get package versions (valid endpoint)
- `/api/example-package` - Would match the catch-all and try to treat as package name
- See `src/app/api/-/README.md` for details

### Diff Flow

1. User enters package specs (e.g., `react@17.0.0...react@18.0.0`)
2. `src/lib/destination/` canonicalizes specs and redirects if needed
3. `src/app/[...parts]/page.tsx` renders the diff page
4. `src/lib/npmDiff/` fetches diff using `libnpmdiff` (server-side)
5. `src/lib/gitDiff/` parses diff into React components
6. `react-diff-view` renders the visual diff

### Next.js App Router & Server vs. Client Components

This project uses **Next.js App Router** (not Pages Router). Refer to the Next.js MCP for App Router best practices.

- Most components are React Server Components by default (no directive needed)
- **`"use client"` directive is REQUIRED** to mark components as client-side
- The `.client.tsx` suffix is a naming convention used when there's a non-client file with the same name
- Interactive forms/inputs must be client components
- Diff rendering is server-side for better performance

## Instructions for Coding Agents

### Before Making Changes

1. Dependencies are installed automatically - just run commands with `pnpm`
2. Run `pnpm run lint && pnpm run test-ci && pnpm run typecheck && pnpm run build` to establish baseline
3. Make note of any pre-existing failures (not your responsibility to fix unrelated issues)

### When Making Code Changes

1. Use the `^/` import alias for all imports from `src/`
2. Follow existing patterns: tests colocated with source, Server Components by default
3. After changes, run: `pnpm run lint-fix` → `pnpm run test-ci` → `pnpm run typecheck` → `pnpm run build`
4. Build takes 10-15 seconds; don't cancel early
5. All four commands must pass for CI to succeed

### When Adding Dependencies

1. Use `pnpm add <package>` or `pnpm add -D <package>` (never npm or yarn)
2. Test that build still works: `pnpm run build`

### When Adding Tests

1. Create `.test.ts` or `.test.tsx` file next to source file
2. Import test utilities: `@testing-library/react`, `@testing-library/jest-dom`
3. Run `pnpm run test-ci` to verify tests pass
4. Tests must complete in reasonable time (current suite: ~3 seconds for 98 tests)

### Trust These Instructions

These instructions have been validated by running all commands and testing the build process. If something doesn't work as documented, it may be a legitimate issue with the repository state. Only search for additional information if these instructions are incomplete or incorrect for your specific task.
