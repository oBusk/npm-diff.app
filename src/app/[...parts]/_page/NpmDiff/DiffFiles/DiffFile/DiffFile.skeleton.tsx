import { Box, Skeleton } from "@chakra-ui/react";
import CollapsableBorderBox from "^/components/CollapsableBorderBox";
import cn from "^/lib/cn";
import contentVisibility from "^/lib/utils/contentVisibility";
import { DiffFileHeaderSkeleton } from "./DiffFileHeader";

const FakeCodeRow = ({
    length,
    indent,
}: {
    length: number;
    indent: number;
}) => (
    <Skeleton
        marginTop="1em"
        marginLeft={indent * 2 + "em"}
        marginBottom="1em"
        height="0.5em"
        width={length + "em"}
    />
);

export default function DiffFileSkeleton() {
    return (
        <CollapsableBorderBox
            className={cn("my-4 text-base", contentVisibility("700px"))}
            header={<DiffFileHeaderSkeleton />}
        >
            <Box
                borderWidth="1px 0"
                background="gray.700"
                padding="10px"
                lineHeight={1.6}
                fontSize="16px"
            >
                <Skeleton height="0.5em" margin="0.5em 0" width="10em" />
            </Box>
            <Box paddingLeft="3em">
                <FakeCodeRow length={8} indent={0} />
                <FakeCodeRow length={14} indent={0} />
                <FakeCodeRow length={10} indent={0} />
                <FakeCodeRow length={4} indent={1} />
                <FakeCodeRow length={8} indent={2} />
                <FakeCodeRow length={2} indent={1} />
                <FakeCodeRow length={4} indent={0} />
            </Box>
        </CollapsableBorderBox>
    );
}
