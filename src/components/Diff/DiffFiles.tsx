import { Box } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { File } from "react-diff-view";
import DiffFileComponent from "./DiffFile";

interface Props {
    files: File[];
}

function hashFromString(s: string): string {
    return s
        .split("")
        .reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
        }, 0)
        .toString(36);
}

const DiffFiles: FunctionComponent<Props> = ({ files }) => (
    <Box minWidth="100%">
        {files.map(({ newPath, newRevision, type, hunks }) => (
            <DiffFileComponent
                key={`${newPath}|${newRevision}`}
                title={newPath}
                type={type}
                hunks={hunks}
                hash={hashFromString(newPath)}
            />
        ))}
    </Box>
);

export default DiffFiles;
