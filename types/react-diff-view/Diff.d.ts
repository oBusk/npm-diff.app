import { Change, File, Hunk } from "gitdiff-parser";
import { FunctionComponent, ReactNode } from "react";
import { HunkData } from "react-diff-view";

export type DiffType = File["type"];
export type ViewType = "unified" | "split";
export type GutterType = "default" | "none" | "anchor";

export type DefaultRender = (token: any, key: string) => JSX.Element;

export interface RenderGutterProp {
    change: Change;
    side: "new" | "old";
    renderDefault: DefaultRender;
    wrapInAnchor: any;
    inHoverState: boolean;
}

// https://github.com/otakustay/react-diff-view/blob/v2.4.7/src/Diff/index.js#L106-L119
export interface DiffProps {
    diffType: DiffType;
    viewType: ViewType;
    hunks: Hunk[];
    gutterType?: GutterType;
    generateAnchorID?: (change: Change) => string | undefined;
    selectedChanges?: string[];
    widgets?: { [k: string]: JSX.Element };
    optimizeSelection?: boolean;
    className?: string;
    renderToken?: (token: any, defaultRender: DefaultRender) => JSX.Element;
    renderGutter?: (props: RenderGutterProp) => JSX.Element;
    children?: (hunks: HunkData[]) => ReactNode;
}

export declare const Diff: FunctionComponent<DiffProps>;
