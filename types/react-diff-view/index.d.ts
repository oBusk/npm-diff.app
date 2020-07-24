import { FunctionComponent } from "react";

export interface DiffFile {
    oldRevision: string;
    newRevision: string;
    type: DiffType;
    hunks: Hunk;
}

export declare const parseDiff: (diffText: string) => DiffFile[];

export type DiffType = "add" | "delete" | "modify" | "rename" | "copy";

export type ViewType = "unified" | "split";

export type GutterType = "default" | "none" | "anchor";

export interface DiffProps {
    diffType: DiffType;
    viewType: ViewType;
    hunks: Hunk[];
    gutterType?: GutterType;
    generateAnchorID?: function;
    selectedChanges?: string[];
    widgets?: { [k: string]: JSX.Element };
    optimizeSelection?: boolean;
    className?: string;
    renderToken?: function;
    renderGutter?: function;
    children?: function;
}

export declare const Diff: FunctionComponent<DiffProps>;

export interface DecorationProps {
    className?: string;
    gutterClassName?: string;
    contentClassName?: string;
    children: JSX.Element[];
}

export declare const Decoration: FunctionComponent<DecorationProps>;

export interface Hunk {
    content: string;
}

export declare const Hunk: Hunk;
