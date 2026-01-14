# @internal/npm-spec

Internal library for NPM package specification resolution.

## Purpose

This package contains all the logic for resolving and canonicalizing npm package specifications. It was extracted from the main website to:

1. **Separate concerns**: Keep UI logic (website) separate from backend npm resolution logic
2. **Improve maintainability**: All npm-related logic is in one place
3. **Reduce dependencies**: The website no longer directly depends on `npm-package-arg`, `pacote`, or `validate-npm-package-name`

## Exports

### Main Functions

- `destination(specsOrVersions)` - Takes specs or versions and returns canonical specs with redirect information
- `canonicalSpec(spec)` - Converts a package spec to its canonical form (always returns same package)
- `versionsToSpecs(specs)` - Handles version-only inputs and converts to full specs

### Types

- `SimplePackageSpec` - Simple package specification with name and version
- `Destination` - Result type from `destination()` function
- `Redirect` - Redirect type (false, "temporary", or "permanent")
- `Packument` - Re-exported from pacote

### Utilities

- `createSimplePackageSpec(spec)` - Create a SimplePackageSpec from a string spec
- `simplePackageSpecToString(spec)` - Convert SimplePackageSpec to string
- `npa` - Re-exported npm-package-arg parser
- `validatePackageName` - Re-exported from validate-npm-package-name

## Usage

```typescript
import { destination, canonicalSpec, npa } from "@internal/npm-spec";

// Get canonical specs with redirect info
const result = await destination(["react@18.0.0", "react@latest"]);
console.log(result.canonicalSpecs); // ['react@18.0.0', 'react@18.2.0']
console.log(result.redirect); // 'temporary'

// Get canonical spec for a single package
const canonical = await canonicalSpec("react@latest");
console.log(canonical); // 'react@18.2.0'

// Parse a package spec
const parsed = npa("react@^18.0.0");
console.log(parsed.name); // 'react'
console.log(parsed.type); // 'range'
```

## Development

```bash
# Build the library
pnpm run build

# Run type checking
pnpm run typecheck
```

## Notes

- This package is **private** and never published to npm
- It's only used within this monorepo via workspace protocol (`workspace:*`)
- The website wraps `canonicalSpec` with Next.js caching
- Tests are included and run as part of the main project's test suite
