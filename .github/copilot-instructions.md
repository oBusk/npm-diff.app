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
- Environment setup is handled automatically via `oBusk/action-pnpm-setup@v1` in CI and Copilot environments

## Next.js MCP Integration

This repository is configured with the Next.js MCP server for enhanced development tooling:

- **MCP Server**: `next-devtools-mcp` (configured in `.vscode/mcp.json`)
- Provides Next.js-specific context, insights, and debugging capabilities
- Automatically available when working with MCP-enabled tools

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
    - Uses `@obusk/eslint-config-next` with temporary rule overrides
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

### Directory Layout

```
/
├── .github/
│   ├── workflows/
│   │   ├── nodejs.yml          # Main CI (lint, test, typecheck, build)
│   │   ├── codeql.yml          # Security scanning
│   │   └── dependency-review.yml
│   └── dependabot.yml
├── public/                     # Static assets (icons, manifest)
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── [...parts]/         # Dynamic diff page route
│   │   │   ├── _page/          # Page components
│   │   │   │   ├── DiffIntro/  # Package info header
│   │   │   │   ├── NpmDiff/    # Main diff display
│   │   │   │   └── SizeComparison/
│   │   │   └── page.tsx        # Main diff page
│   │   ├── _layout/            # Layout components (Header, Footer)
│   │   ├── _page/              # Home page components
│   │   │   └── MainForm/       # Package input form
│   │   ├── about/              # About pages
│   │   ├── api/                # API routes
│   │   │   ├── -/              # Prefixed APIs (e.g., /-/versions)
│   │   │   └── [...parts]/     # Dynamic API route
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/             # Shared React components
│   │   └── ui/                 # UI primitives (shadcn/ui style)
│   └── lib/                    # Utility libraries
│       ├── api/                # API clients (npm, bundlephobia, etc.)
│       ├── autocomplete/       # Package autocomplete logic
│       ├── destination/        # URL/spec canonicalization
│       ├── gitDiff/            # Git diff parsing
│       ├── npmDiff/            # npm diff wrapper (uses libnpmdiff)
│       ├── query/              # Query parameter parsing
│       └── utils/              # General utilities
├── __mocks__/                  # Jest mocks
├── eslint.config.mjs           # ESLint configuration
├── jest.config.js              # Jest configuration
├── jest.setup.js               # Jest setup (mocks react.cache)
├── next.config.js              # Next.js configuration
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── pnpm-workspace.yaml         # pnpm workspace config
└── package.json                # Dependencies and scripts
```

### Key Configuration Files

- **next.config.js**: Enables React Strict Mode, configures server external packages (`libnpmdiff`, `npm-package-arg`, `pacote`)
- **tsconfig.json**: Path alias `^/*` maps to `src/*` (use this in imports)
- **eslint.config.mjs**: Uses `@obusk/eslint-config-next` with temporary rule overrides (many rules disabled for gradual migration)
- **jest.config.js**: Uses `next/jest` for Next.js integration, jsdom environment, mocks defined in `__mocks__/`
- **tailwind.config.ts**: Tailwind CSS with custom theme and animations
- **.editorconfig**: 4-space indentation, LF line endings, 80-char line length

### Import Paths

**Always use the `^/` alias for imports from `src/`:**

```typescript
import { something } from "^/lib/utils"; // Correct
import { something } from "@/lib/utils"; // Wrong - @ not configured
import { something } from "../../../lib/utils"; // Avoid - use alias
```

## CI/CD Workflows

### Main CI Pipeline (.github/workflows/nodejs.yml)

Runs on every push and pull request. **All jobs must pass for PR to merge.**

1. **lint**: Runs `pnpm run lint` (includes prettier check)
2. **test**: Runs `pnpm run test-ci`
3. **typecheck**: Runs `pnpm run typecheck`
4. **build**: Runs `pnpm run build`

Each job:

- Uses `ubuntu-latest` runner
- 5-minute timeout
- Sets `CI=true` environment variable
- Uses `oBusk/action-pnpm-setup@v1` for Node/pnpm setup

### CodeQL Scanning (.github/workflows/codeql.yml)

- Runs on push to main, PRs to main, and weekly schedule
- Analyzes JavaScript/TypeScript and GitHub Actions
- Build mode: none (no build required for JS/TS analysis)

### Dependency Review (.github/workflows/dependency-review.yml)

- Runs on pull requests only
- Blocks PRs that introduce known-vulnerable packages

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

### Server vs. Client Components

- Most components are React Server Components (no `"use client"` directive)
- Client components have `.client.tsx` extension or explicit `"use client"` directive
- Interactive forms/inputs are client components
- Diff rendering is server-side for better performance

## Key Dependencies

### Runtime

- **next** (16.0.10): Framework (App Router, Turbopack, Edge Runtime)
- **react** (19.2.3) & **react-dom**: UI library
- **libnpmdiff** (6.1.4): Core npm diff functionality (server-only)
- **pacote** (18.0.6): npm package fetching (server-only)
- **npm-package-arg** (11.0.3): Parse npm package specifiers
- **react-diff-view** (3.3.2): Visual diff rendering
- **gitdiff-parser** (0.3.1): Parse git diff format
- **tailwindcss** (3.4.19): Styling
- **downshift** (9.0.13): Combobox/autocomplete

### Dev Tools

- **typescript** (5.9.3): TypeScript compiler
- **eslint** (9.39.2): Linting (flat config format)
- **prettier** (3.7.4): Code formatting
- **jest** (30.2.0) & **@testing-library/react**: Testing
- **@obusk/eslint-config-next**: Custom ESLint config

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
