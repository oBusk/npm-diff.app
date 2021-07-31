import { Heading, HeadingProps, Text, Tooltip } from "@chakra-ui/react";
import { FunctionComponent } from "react";

export interface DiffFileHeaderProps extends HeadingProps {
    additions: number;
    deletions: number;
}

const DiffFileHeader: FunctionComponent<DiffFileHeaderProps> = ({
    additions,
    deletions,
    children,
    ...props
}) => {
    return (
        <Heading size="sm" {...props}>
            {children}{" "}
            <Tooltip
                label={`${
                    additions + deletions
                } changes: ${additions} additions & ${deletions} deletions`}
            >
                <Text as="span">
                    <Text as="span" color="green.200" padding="0 4px">
                        +++{additions}
                    </Text>
                    <Text as="span" color="red.200" padding="0 4px">
                        ---{deletions}
                    </Text>
                </Text>
            </Tooltip>
        </Heading>
    );
};

export default DiffFileHeader;
