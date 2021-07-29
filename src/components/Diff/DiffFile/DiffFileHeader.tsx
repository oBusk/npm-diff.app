import {
    BoxProps,
    Box,
    Heading,
    IconButton,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FunctionComponent } from "react";

export interface DiffFileHeaderProps extends BoxProps {
    title: string;
    additions: number;
    deletions: number;
    isExpanded: boolean;
    toggleIsExpanded: () => void;
}

const DiffFileHeader: FunctionComponent<DiffFileHeaderProps> = ({
    title,
    additions,
    deletions,
    isExpanded,
    toggleIsExpanded,
    ...props
}) => {
    return (
        <Box borderBottomWidth="1px" padding="8px" {...props}>
            <Heading size="sm">
                <Tooltip
                    label={(isExpanded ? "Collapse" : "Expand") + " " + title}
                >
                    <IconButton
                        onClick={() => toggleIsExpanded()}
                        aria-label="Toggle showing file"
                        size="sm"
                        icon={
                            isExpanded ? (
                                <ChevronDownIcon />
                            ) : (
                                <ChevronRightIcon />
                            )
                        }
                        marginRight="10px"
                    />
                </Tooltip>
                {title}{" "}
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
        </Box>
    );
};

export default DiffFileHeader;
