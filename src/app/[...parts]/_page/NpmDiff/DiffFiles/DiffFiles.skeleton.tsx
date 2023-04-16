import { Box } from "@chakra-ui/react";
import { DiffFileSkeleton } from "./DiffFile";

export default function DiffFilesSkeleton() {
    return (
        <Box css={{ label: "DiffFiles", contain: "content", minWidth: "100%" }}>
            <DiffFileSkeleton />
        </Box>
    );
}
