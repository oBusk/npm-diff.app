import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
    Flex,
    FlexProps,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    Input,
    Button,
    Tooltip,
    Box,
    Heading,
} from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";

export interface OptionsFormProps extends FlexProps {
    files: string;
    filesChange: (value: string) => void;
}

const OptionsForm: FunctionComponent<OptionsFormProps> = ({
    files,
    filesChange,
    ...props
}) => {
    const [isExpanded, setExpanded] = useState(false);

    return (
        <Flex direction="column" alignItems="center" {...props}>
            {isExpanded && (
                <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    padding="20px"
                    marginTop="20px"
                    overflow="auto"
                >
                    <Heading size="sm">Options</Heading>
                    <FormControl id="files">
                        <FormLabel>Files</FormLabel>
                        <Input
                            type="text"
                            value={files}
                            onChange={(event) =>
                                filesChange(event.target.value)
                            }
                        />
                        <FormHelperText>
                            Define what files of the package to check the
                            differance of
                        </FormHelperText>
                    </FormControl>
                </Box>
            )}

            <Tooltip label={`${isExpanded ? "Hide" : "Show"} more options`}>
                <Button
                    onClick={() => setExpanded(!isExpanded)}
                    rightIcon={
                        isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />
                    }
                    marginBottom="8px"
                    marginTop={isExpanded ? 0 : "20px"}
                    borderTopRadius={isExpanded ? 0 : undefined}
                    borderTopWidth={isExpanded ? 0 : undefined}
                    variant="outline"
                >
                    Options
                </Button>
            </Tooltip>
        </Flex>
    );
};

export default OptionsForm;
