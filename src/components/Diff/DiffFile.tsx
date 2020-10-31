import { FC } from "react";
import { Diff, DiffType, HunkData } from "react-diff-view";
import DiffHunk from "./DiffHunk";
import "react-diff-view/style/index.css";

type Props = {
    hunks: HunkData[];
    type: DiffType;
};

const DiffFile: FC<Props> = ({ type, hunks }) => (
    <Diff viewType="split" diffType={type} hunks={hunks}>
        {(hunks: HunkData[]) =>
            hunks.map((hunk) => (
                <DiffHunk key={"decoration-" + hunk.content} hunk={hunk} />
            ))
        }
    </Diff>
);

export default DiffFile;
