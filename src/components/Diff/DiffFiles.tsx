import { Box } from "@chakra-ui/react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
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

const FILE_HEADER_HEIGHT = 49;
const HUNK_HEADER_HEIGHT = 44;
const LINE_HEIGHT = 24;
const FILE_PADDING = 16;

const DiffFiles: FunctionComponent<Props> = ({ files }) => {
    const rowVirtualizer = useWindowVirtualizer({
        count: files.length,
        initialRect: {
            width: 1920,
            height: 1080,
        },
        estimateSize: (index) => {
            const file = files[index];

            const fileHeaderHeight = FILE_HEADER_HEIGHT;
            // Each hunk has a header `@@ -1,6 +1,6 @@`
            const hunkHeadersHeight = HUNK_HEADER_HEIGHT * file.hunks.length;
            const linesHeight =
                LINE_HEIGHT *
                file.hunks.reduce(
                    (numLines, hunk) =>
                        numLines + Math.max(hunk.oldLines, hunk.newLines),
                    0,
                );

            return (
                fileHeaderHeight +
                hunkHeadersHeight +
                linesHeight +
                FILE_PADDING
            );
        },
        getItemKey: (index) => {
            const { oldPath, newPath } = files[index];
            return `${oldPath}➡${newPath}`;
        },
    });

    return (
        <Box
            minWidth="100%"
            height={rowVirtualizer.getTotalSize()}
            position="relative"
        >
            {rowVirtualizer
                .getVirtualItems()
                .map(({ key, index, start, measureElement }) => {
                    const { newPath, type, hunks } = files[index];
                    return (
                        <Box
                            key={key}
                            ref={measureElement}
                            position="absolute"
                            top={0}
                            left={0}
                            width="100%"
                            transform={`translateY(${start}px)`}
                            padding={`0 0 ${FILE_PADDING}px 0`}
                        >
                            <DiffFileComponent
                                title={newPath}
                                type={type}
                                hunks={hunks}
                                hash={hashFromString(newPath)}
                                width="100%"
                            />
                        </Box>
                    );
                })}
        </Box>
    );
};

export default DiffFiles;
