import { FunctionComponent } from "react";
import { File } from "react-diff-view";
import DiffFileComponent from "./DiffFile";

interface Props {
    files: File[];
}

const DiffFiles: FunctionComponent<Props> = ({ files }) => (
    <div>
        {files.map(({ oldRevision, newRevision, type, hunks }) => (
            <DiffFileComponent
                key={oldRevision + "-" + newRevision}
                type={type}
                hunks={hunks}
            />
        ))}
    </div>
);

export default DiffFiles;
