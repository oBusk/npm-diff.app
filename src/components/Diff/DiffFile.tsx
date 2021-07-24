import { FunctionComponent } from "react";
import { Diff, DiffType, HunkData } from "react-diff-view";
import "react-diff-view/style/index.css";
import DiffHunk from "./DiffHunk";

type Props = {
    hunks: HunkData[];
    type: DiffType;
    hash: string;
};

const DiffFile: FunctionComponent<Props> = ({ type, hunks, hash }) => (
    <Diff
        viewType="split"
        diffType={type}
        hunks={hunks}
        gutterType="anchor"
        generateAnchorID={({ lineNumber }) => `${hash}-L${lineNumber}`}
    >
        {(hunks: HunkData[]) =>
            hunks.map((hunk) => (
                <DiffHunk key={"decoration-" + hunk.content} hunk={hunk} />
            ))
        }
    </Diff>
);

export default DiffFile;
