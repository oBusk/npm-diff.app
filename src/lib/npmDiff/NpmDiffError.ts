export type NpmDiffError =
    | { kind: "not-found"; message: string }
    | { kind: "unknown"; message: string };
