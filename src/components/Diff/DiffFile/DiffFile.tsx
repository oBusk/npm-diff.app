import { forwardRef, useBreakpointValue } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { DiffType, HunkData, ViewType } from "react-diff-view";
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

interface DiffFileProps extends CollapsableBorderBoxProps {
    hunks: HunkData[];
    type: DiffType;
    hash: string;
    title: string;
}

const DiffFile = forwardRef<DiffFileProps, typeof CollapsableBorderBox>(
    ({ type, hunks, hash, title, ...props }, ref) => {
        const viewType =
            useBreakpointValue<ViewType>({
                base: "unified",
                lg: "split",
            }) ?? "split";
        const { additions, deletions } = countChanges(hunks);
        const [render, setRender] = useState(type !== "delete");

        return (
            <CollapsableBorderBox
                header={
                    <DiffFileHeader additions={additions} deletions={deletions}>
                        {title}
                    </DiffFileHeader>
                }
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
                        generateAnchorID={({ lineNumber }) =>
                            `${hash}-L${lineNumber}`
                        }
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
