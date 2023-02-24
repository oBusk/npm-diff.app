import { Box } from "@chakra-ui/react";
import type { Result as NpaResult } from "npm-package-arg";
import { FunctionComponent } from "react";
import { FileData, ViewType } from "react-diff-view";
import DiffFileComponent from "./DiffFile";

interface DiffFilesProps {
    a: NpaResult;
    b: NpaResult;
    files: FileData[];
    viewType: ViewType;
}

const DiffFiles: FunctionComponent<DiffFilesProps> = ({
    a,
    b,
    files,
    viewType,
}) => {
    return (
        <Box css={{ label: "DiffFiles", contain: "content", minWidth: "100%" }}>
            {files.map((file, index) => (
                <DiffFileComponent
                    key={`${file.oldPath}➡${file.newPath}`}
                    index={index}
                    a={a}
                    b={b}
                    file={file}
                    viewType={viewType}
                    width="100%"
                />
            ))}
        </Box>
    );
};

export default DiffFiles;
