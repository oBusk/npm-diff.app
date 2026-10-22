export type NpmDiffError =
    | { kind: "not-found"; message: string }
    | { kind: "timeout"; message: string }
    | { kind: "unknown"; message: string };
