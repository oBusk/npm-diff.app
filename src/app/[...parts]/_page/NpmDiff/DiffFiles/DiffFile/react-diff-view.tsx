import type { ComponentProps, FunctionComponent } from "react";
import {
    Decoration as _Decoration,
    Diff as _Diff,
    Hunk as _Hunk,
    type HunkProps,
} from "react-diff-view";
import "react-diff-view/style/index.css";
import "./react-diff-view.css";

const Diff = _Diff;
const Hunk = _Hunk as FunctionComponent<HunkProps & ComponentProps<"div">>;
const Decoration = _Decoration;

export { Hunk, Diff, Decoration };
