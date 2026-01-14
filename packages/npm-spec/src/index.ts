// Main exports
export { default as destination } from "./destination";
export type { Destination, Redirect } from "./destination";

export { default as canonicalSpec } from "./canonicalSpec";
export { default as versionsToSpecs } from "./versionsToSpecs";

// SimplePackageSpec utilities
export type { default as SimplePackageSpec } from "./SimplePackageSpec";
export { simplePackageSpecToString } from "./SimplePackageSpec";
export { createSimplePackageSpec } from "./createSimplePackageSpec";

// Re-export npa for consumers who need it
export { default as npa } from "npm-package-arg";
export type { Result as NpaResult, AliasResult } from "npm-package-arg";

// Re-export pacote types for consumers
export type { Packument } from "pacote";

// Re-export validate-npm-package-name for consumers
export { default as validatePackageName } from "validate-npm-package-name";
