import { Box } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import useVirtual from "react-cool-virtual";
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

const DiffFiles: FunctionComponent<Props> = ({ files }) => {
    const { outerRef, innerRef, items } = useVirtual({
        itemCount: files.length,
        itemSize: 187, // the size of the "load diff" placeholder
        ssrItemCount: 10,
    });

    return (
        <Box minWidth="100%" ref={outerRef as any}>
            <Box ref={innerRef as any}>
                {items.map(({ index, measureRef }) => {
                    const { newPath, newRevision, type, hunks } = files[index];
                    return (
                        <DiffFileComponent
                            key={`${newPath}|${newRevision}`}
                            ref={measureRef}
                            title={newPath}
                            type={type}
                            hunks={hunks}
                            hash={hashFromString(newPath)}
                        />
                    );
                })}
            </Box>
        </Box>
    );
};

export default DiffFiles;
