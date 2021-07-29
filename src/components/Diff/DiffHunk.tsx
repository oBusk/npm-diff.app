import { Box, BoxProps, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Decoration, Hunk, HunkData } from "react-diff-view";

const DiffDecoration: FunctionComponent<BoxProps> = ({ ...props }) => (
    <Box as={Decoration} {...props}></Box>
);

interface DiffHunkProps {
    hunk: HunkData;
}

const DiffHunk: FunctionComponent<DiffHunkProps> = ({ hunk }) => (
    <>
        <DiffDecoration
            borderTopWidth="1px"
            borderBottomWidth="1px"
            color="gray"
            bg="gray.100"
        >
            <Text padding="10px">{hunk.content}</Text>
        </DiffDecoration>
        <Hunk hunk={hunk}></Hunk>
    </>
);

export default DiffHunk;
