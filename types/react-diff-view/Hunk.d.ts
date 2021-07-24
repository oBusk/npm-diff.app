import { Hunk as HunkData } from "gitdiff-parser";
import { FunctionComponent } from "react";

export interface HunkProps {
    hunk: HunkData;
}

export declare const Hunk: FunctionComponent<HunkProps>;
