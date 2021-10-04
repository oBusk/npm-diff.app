import { useBreakpointValue } from "@chakra-ui/react";
import { Diff } from "_/components/react-diff-view";
import CollapsableBorderBox, {
    CollapsableBorderBoxProps,
} from "_/components/theme/CollapsableBorderBox";
import countChanges from "_/lib/utils/countChanges";
import { FunctionComponent } from "react";
import { DiffType, HunkData, ViewType } from "react-diff-view";
import "react-diff-view/style/index.css";
import DiffHunk from "../DiffHunk";
import DiffFileHeader from "./DiffFileHeader";

interface DiffFileProps extends CollapsableBorderBoxProps {
    hunks: HunkData[];
    type: DiffType;
    hash: string;
    title: string;
}

const DiffFile: FunctionComponent<DiffFileProps> = ({
    type,
    hunks,
    hash,
    title,
    ...props
}) => {
    const viewType =
        useBreakpointValue<ViewType>({
            base: "unified",
            lg: "split",
        }) ?? "split";

    const { additions, deletions } = countChanges(hunks);

    return (
        <CollapsableBorderBox
            margin="1em 0"
            header={
                <DiffFileHeader additions={additions} deletions={deletions}>
                    {title}
                </DiffFileHeader>
            }
            {...props}
        >
            <Diff
                minWidth="50em"
                viewType={viewType}
                diffType={type}
                hunks={hunks}
                gutterType="anchor"
                generateAnchorID={({ lineNumber }) => `${hash}-L${lineNumber}`}
            >
                {(hunks: HunkData[]) =>
                    hunks.map((hunk) => (
                        <DiffHunk
                            key={"decoration-" + hunk.content}
                            hunk={hunk}
                        />
                    ))
                }
            </Diff>
        </CollapsableBorderBox>
    );
};

export default DiffFile;
