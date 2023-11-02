import { type FunctionComponent } from "react";
import type { HunkData } from "react-diff-view";
import { cx } from "^/lib/cva";
import contentVisibility from "^/lib/utils/contentVisibility";
import { Decoration, Hunk } from "./react-diff-view";

interface DiffHunkProps {
    hunk: HunkData;
}

const DiffHunk: FunctionComponent<DiffHunkProps> = ({ hunk }) => (
    <>
        <Decoration
            className={cx(
                "border-y bg-muted text-muted-foreground",
                contentVisibility("800px"),
            )}
        >
            <p className="p-2.5">{hunk.content}</p>
        </Decoration>
        <Hunk hunk={hunk} className="contain-content"></Hunk>
    </>
);

export default DiffHunk;
