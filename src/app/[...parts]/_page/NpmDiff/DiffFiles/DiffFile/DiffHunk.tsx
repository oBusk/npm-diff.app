import { Text } from "@chakra-ui/react";
import { type FunctionComponent } from "react";
import { type HunkData } from "react-diff-view";
import contentVisibility from "^/lib/utils/contentVisibility";
import { Decoration, Hunk } from "./react-diff-view";

interface DiffHunkProps {
    hunk: HunkData;
}

const DiffHunk: FunctionComponent<DiffHunkProps> = ({ hunk }) => (
    <>
        <Decoration
            borderTopWidth="1px"
            borderBottomWidth="1px"
            background="gray.100"
            color="gray.700"
            _dark={{ background: "gray.700", color: "gray.100" }}
            css={{
                label: "DiffHunk",
                ...contentVisibility("800px"),
            }}
        >
            <Text padding="10px">{hunk.content}</Text>
        </Decoration>
        <Hunk hunk={hunk} css={{ label: "Hunk", contain: "content" }}></Hunk>
    </>
);

export default DiffHunk;
