"use client";

import {
    type ElementRef,
    forwardRef,
    useCallback,
    useMemo,
    useState,
} from "react";
import type { ChangeData, FileData, ViewType } from "react-diff-view";
import CollapsableBorderBox, {
    type CollapsableBorderBoxProps,
} from "^/components/CollapsableBorderBox";
import { cx } from "^/lib/cva";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import contentVisibility from "^/lib/utils/contentVisibility";
import countChanges from "^/lib/utils/countChanges";
import DiffFileHeader from "./DiffFileHeader";
import DiffHunk from "./DiffHunk";
import DiffPlaceholder from "./DiffPlaceholder";
import { Diff } from "./react-diff-view";

const FILES_TO_RENDER = 2 ** 6;
const CHANGES_TO_RENDER = 2 ** 7;

export interface DiffFileProps extends CollapsableBorderBoxProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    file: FileData;
    viewType: ViewType;
    index: number;
}

const DiffFile = forwardRef<
    ElementRef<typeof CollapsableBorderBox>,
    DiffFileProps
>(({ a, b, file, viewType, index, className, ...props }, ref) => {
    const { type, hunks, oldPath, newPath } = file;

    const countedChanges = useMemo(() => countChanges(hunks), [hunks]);

    const [avoidRender, setAvoidRender] = useState(
        type === "delete"
            ? "This file was deleted."
            : countedChanges.changes > CHANGES_TO_RENDER
              ? "Large diffs are not rendered by default."
              : index > FILES_TO_RENDER
                ? true
                : null,
    );
    const render = () => setAvoidRender(null);

    const generateAnchorID = useCallback(
        (change: ChangeData) =>
            `${type === "delete" ? oldPath : newPath}-L${
                change.type !== "normal"
                    ? change.lineNumber
                    : change.oldLineNumber
            }`,
        [type, oldPath, newPath],
    );

    return (
        <CollapsableBorderBox
            className={cx("my-4", contentVisibility("700px", className))}
            header={
                <DiffFileHeader
                    a={a}
                    b={b}
                    file={file}
                    countedChanges={countedChanges}
                />
            }
            {...props}
            ref={ref}
        >
            {avoidRender ? (
                <DiffPlaceholder
                    reason={
                        typeof avoidRender === "string"
                            ? avoidRender
                            : undefined
                    }
                    onClick={render}
                />
            ) : (
                <Diff
                    className="min-w-[50em]"
                    viewType={viewType}
                    diffType={type}
                    hunks={hunks}
                    gutterType="anchor"
                    generateAnchorID={generateAnchorID}
                >
                    {(hunks) =>
                        hunks.map((hunk) => (
                            <DiffHunk
                                key={"decoration-" + hunk.content}
                                hunk={hunk}
                            />
                        ))
                    }
                </Diff>
            )}
        </CollapsableBorderBox>
    );
});
DiffFile.displayName = "DiffFile";

export default DiffFile;
