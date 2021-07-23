import { FunctionComponent } from "react";
import { Decoration, Hunk, HunkData } from "react-diff-view";

interface Props {
    hunk: HunkData;
}

const DiffHunk: FunctionComponent<Props> = ({ hunk }) => (
    <>
        <Decoration>{hunk.content}</Decoration>
        <Hunk hunk={hunk}></Hunk>
    </>
);

export default DiffHunk;
