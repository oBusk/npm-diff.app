import { Text } from "@chakra-ui/react";
import { Decoration } from "components/react-diff-view";
import { FunctionComponent } from "react";
import { HunkData } from "react-diff-view";
import { Hunk } from "components/react-diff-view";

interface DiffHunkProps {
    hunk: HunkData;
}

const DiffHunk: FunctionComponent<DiffHunkProps> = ({ hunk }) => (
    <>
        <Decoration
            borderTopWidth="1px"
            borderBottomWidth="1px"
            color="gray"
            bg="gray.100"
        >
            <Text padding="10px">{hunk.content}</Text>
        </Decoration>
        <Hunk hunk={hunk}></Hunk>
    </>
);

export default DiffHunk;
