/* eslint-disable @typescript-eslint/no-explicit-any */

export type HunkType = any;

export interface DiffFile {
    oldRevision: string;
    newRevision: string;
    type: string;
    hunks: HunkType;
}

export declare const parseDiff: (diffText: string) => DiffFile[];
export declare const Diff: any;
export declare const Hunk: any;
