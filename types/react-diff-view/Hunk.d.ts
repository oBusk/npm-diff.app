import { Hunk as HunkData } from "gitdiff-parser";
import { FunctionComponent, PropsWithChildren } from "react";

export interface HunkProps {
    hunk: HunkData;
}

export declare const Hunk: FunctionComponent<PropsWithChildren<HunkProps>>;
