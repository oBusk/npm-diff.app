import { FunctionComponent, Props } from "react";

export interface DiffFile {
    oldRevision: string;
    newRevision: string;
    type: DiffType;
    hunks: HunkData[];
}

export declare const parseDiff: (diffText: string) => DiffFile[];

export type DiffType = "add" | "delete" | "modify" | "rename" | "copy";

export type ViewType = "unified" | "split";

export type GutterType = "default" | "none" | "anchor";

export interface DiffProps {
    diffType: DiffType;
    viewType: ViewType;
    hunks: HunkData[];
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

export interface DecorationProps extends Props {
    className?: string;
    gutterClassName?: string;
    contentClassName?: string;
}

export declare const Decoration: FunctionComponent<DecorationProps>;

export interface HunkData {
    content: string;
}

export declare const Hunk: FunctionComponent<{ hunk: HunkData }>;
