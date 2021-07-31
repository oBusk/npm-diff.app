import CollapsableBorderBox, {
    CollapsableBorderBoxProps,
} from "components/theme/CollapsableBorderBox";
import countChanges from "lib/utils/countChanges";
import { FunctionComponent } from "react";
import { Diff, DiffType, HunkData } from "react-diff-view";
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
    const { additions, deletions } = countChanges(hunks);

    return (
        <CollapsableBorderBox
            margin="16px"
            header={
                <DiffFileHeader additions={additions} deletions={deletions}>
                    {title}
                </DiffFileHeader>
            }
            {...props}
        >
            <Diff
                viewType="split"
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
