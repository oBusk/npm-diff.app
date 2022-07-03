import { forwardRef, useBoolean } from "@chakra-ui/react";
import type { Result as NpaResult } from "npm-package-arg";
import { useCallback, useMemo, useState } from "react";
import type { Change, File, ViewType } from "react-diff-view";
import "react-diff-view/style/index.css";
import { Diff } from "^/components/react-diff-view";
import {
    CollapsableBorderBox,
    CollapsableBorderBoxProps,
} from "^/components/theme";
import countChanges from "^/lib/utils/countChanges";
import DiffFileHeader from "./DiffFileHeader";
import DiffHunk from "./DiffHunk";
import DiffPlaceholder from "./DiffPlaceholder";

const FILES_TO_RENDER = 2 ** 6;
const CHANGES_TO_RENDER = 2 ** 7;

function hashFromString(s: string): string {
    return s
        .split("")
        .reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
        }, 0)
        .toString(36);
}

interface DiffFileProps extends CollapsableBorderBoxProps {
    a: NpaResult;
    b: NpaResult;
    file: File;
    viewType: ViewType;
    index: number;
}

const DiffFile = forwardRef<DiffFileProps, typeof CollapsableBorderBox>(
    ({ a, b, file, viewType, index, ...props }, ref) => {
        const { type, hunks, oldPath, newPath } = file;

        const countedChanges = useMemo(() => countChanges(hunks), [hunks]);

        const [avoidRender, setAvoidRender] = useState(
            type === "delete"
                ? "This file was deleted."
                : index > FILES_TO_RENDER
                ? true
                : countedChanges.changes > CHANGES_TO_RENDER
                ? "Large diffs are not rendered by default."
                : null,
        );
        const render = useCallback(
            () => setAvoidRender(null),
            [setAvoidRender],
        );

        const generateAnchorID = useCallback(
            ({ lineNumber }: Change) =>
                `${hashFromString(`${oldPath}➡${newPath}`)}-L${lineNumber}`,
            [newPath, oldPath],
        );

        return (
            <CollapsableBorderBox
                header={
                    <DiffFileHeader
                        a={a}
                        b={b}
                        file={file}
                        countedChanges={countedChanges}
                    />
                }
                margin="1em 0"
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
                        minWidth="50em"
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
    },
);

export default DiffFile;
