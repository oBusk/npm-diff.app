// Re-export SimplePackageSpec types from the internal library
import type { SimplePackageSpec } from "@internal/npm-spec";

export type { SimplePackageSpec };
export type { SimplePackageSpec as default };
export { simplePackageSpecToString } from "@internal/npm-spec";
