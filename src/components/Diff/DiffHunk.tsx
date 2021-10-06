import { Text, useColorModeValue } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { HunkData } from "react-diff-view";
import { Decoration, Hunk } from "-/components/react-diff-view";

interface DiffHunkProps {
    hunk: HunkData;
}

const DiffHunk: FunctionComponent<DiffHunkProps> = ({ hunk }) => {
    const background = useColorModeValue("gray.100", "gray.700");
    const color = useColorModeValue("gray.700", "gray.100");

    return (
        <>
            <Decoration
                borderTopWidth="1px"
                borderBottomWidth="1px"
                color={color}
                background={background}
            >
                <Text padding="10px">{hunk.content}</Text>
            </Decoration>
            <Hunk hunk={hunk}></Hunk>
        </>
    );
};

export default DiffHunk;
