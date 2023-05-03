import { Box } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { FileData } from "react-diff-view";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import useViewType from "^/lib/utils/useViewType";
import DiffFileComponent from "./DiffFile";

export interface DiffFilesProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    files: FileData[];
}

const DiffFiles: FunctionComponent<DiffFilesProps> = ({ a, b, files }) => {
    const viewType = useViewType();

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
                    className="w-full"
                />
            ))}
        </Box>
    );
};

export default DiffFiles;
