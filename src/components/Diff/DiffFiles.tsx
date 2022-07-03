import { Box } from "@chakra-ui/react";
import {
    observeWindowOffset as defaultObserveWindowOffset,
    useWindowVirtualizer,
} from "@tanstack/react-virtual";
import {
    FunctionComponent,
    MutableRefObject,
    useCallback,
    useRef,
} from "react";
import { File, ViewType } from "react-diff-view";
import DiffFileComponent from "./DiffFile";

interface DiffFilesProps {
    files: File[];
    viewType: ViewType;
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
/** The offset of the scroll-list from the top of the document */
const ESTIMATED_OFFSET_TOP = 574;

const DiffFiles: FunctionComponent<DiffFilesProps> = ({ files, viewType }) => {
    const scrollHolderOffset = useRef<number | undefined>(undefined);
    const rowVirtualizer = useWindowVirtualizer({
        count: files.length,
        initialOffset: 0 - ESTIMATED_OFFSET_TOP,
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
        observeElementOffset: (instance, cb) =>
            defaultObserveWindowOffset(instance, (scrollX) => {
                /**
                 * The distance of the scrollHolder from the top of the document
                 *
                 * This is subtracted from the ScrollX to account for header/intro
                 */
                const offsetTop =
                    scrollHolderOffset.current ?? ESTIMATED_OFFSET_TOP;
                const newOffset = scrollX - offsetTop;
                return cb(newOffset);
            }),
    });

    // We make an assumption that the offsetWill never change
    // TODO: Run this on mount and every time the window is resized to
    //       not have to worry about assumption
    const measureScrollHolderOffset = useCallback((el: HTMLDivElement) => {
        (scrollHolderOffset as MutableRefObject<number | undefined>).current =
            el?.offsetTop;
    }, []);

    return (
        <Box
            ref={measureScrollHolderOffset}
            minWidth="100%"
            position="relative"
            style={{
                height: rowVirtualizer.getTotalSize(),
            }}
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
                            padding={`0 0 ${FILE_PADDING}px 0`}
                            style={{
                                transform: `translateY(${start}px)`,
                            }}
                        >
                            <DiffFileComponent
                                title={newPath}
                                type={type}
                                hunks={hunks}
                                hash={hashFromString(newPath)}
                                viewType={viewType}
                                width="100%"
                            />
                        </Box>
                    );
                })}
        </Box>
    );
};

export default DiffFiles;
