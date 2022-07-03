import { forwardRef } from "@chakra-ui/react";
import type { Result as NpaResult } from "npm-package-arg";
import { useCallback, useState } from "react";
import type { Change, File, ViewType } from "react-diff-view";
import "react-diff-view/style/index.css";
import { Diff } from "^/components/react-diff-view";
import {
    CollapsableBorderBox,
    CollapsableBorderBoxProps,
} from "^/components/theme";
import DiffFileHeader from "./DiffFileHeader";
import DiffHunk from "./DiffHunk";
import DiffPlaceholder from "./DiffPlaceholder";

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
}

const DiffFile = forwardRef<DiffFileProps, typeof CollapsableBorderBox>(
    ({ a, b, file, viewType, ...props }, ref) => {
        const { type, hunks, oldPath, newPath } = file;
        const [render, setRender] = useState(type !== "delete");
        const generateAnchorID = useCallback(
            ({ lineNumber }: Change) =>
                `${hashFromString(`${oldPath}➡${newPath}`)}-L${lineNumber}`,
            [newPath, oldPath],
        );

        return (
            <CollapsableBorderBox
                header={<DiffFileHeader a={a} b={b} file={file} />}
                {...props}
                ref={ref}
            >
                {render ? (
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
                ) : (
                    <DiffPlaceholder
                        reason={
                            type === "delete"
                                ? "This file was deleted."
                                : undefined
                        }
                        onClick={() => setRender(true)}
                    />
                )}
            </CollapsableBorderBox>
        );
    },
);

export default DiffFile;
