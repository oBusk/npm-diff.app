import { Box, BoxProps } from "@chakra-ui/react";
import countChanges from "lib/utils/countChanges";
import { FunctionComponent, useState } from "react";
import { Diff, DiffType, HunkData } from "react-diff-view";
import "react-diff-view/style/index.css";
import DiffHunk from "../DiffHunk";
import DiffFileHeader from "./DiffFileHeader";

interface DiffFileProps extends BoxProps {
    hunks: HunkData[];
    type: DiffType;
    hash: string;
    newPath: string;
}

const DiffFile: FunctionComponent<DiffFileProps> = ({
    type,
    hunks,
    hash,
    newPath,
    ...props
}) => {
    const { additions, deletions } = countChanges(hunks);
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            margin="16px"
            {...props}
        >
            <DiffFileHeader
                title={newPath}
                additions={additions}
                deletions={deletions}
                isExpanded={isExpanded}
                toggleIsExpanded={() => setIsExpanded(!isExpanded)}
            />
            {isExpanded && (
                <Box padding="16px 0">
                    <Diff
                        viewType="split"
                        diffType={type}
                        hunks={hunks}
                        gutterType="anchor"
                        generateAnchorID={({ lineNumber }) =>
                            `${hash}-L${lineNumber}`
                        }
                    >
                        {(hunks: HunkData[]) =>
                            hunks.map((hunk) => (
                                <DiffHunk
                                    key={"decoration-" + hunk.content}
                                    hunk={hunk}
                                />
                            ))
                        }
                    </Diff>
                </Box>
            )}
        </Box>
    );
};

export default DiffFile;
