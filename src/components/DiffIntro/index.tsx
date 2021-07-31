import {
    Box,
    Code,
    Flex,
    FlexProps,
    forwardRef,
    Heading,
    Text,
} from "@chakra-ui/react";
import BorderBox from "components/theme/BorderBox";
import { FunctionComponent } from "react";
import ServiceLinks from "./ServiceLinks";

const SpecBox: FunctionComponent<{ packageSpec: string }> = ({
    packageSpec,
}) => (
    <Box>
        <Code>{packageSpec}</Code>
        <Text>
            <ServiceLinks packageSpec={packageSpec} />
        </Text>
    </Box>
);

export interface DiffIntroProps extends FlexProps {
    a: string;
    b: string;
    changedFiles: number;
    additions: number;
    deletions: number;
}

const DiffIntro = forwardRef<DiffIntroProps, "h2">(
    ({ a, b, changedFiles, additions, deletions, ...props }, ref) => {
        return (
            <Flex direction="column" alignItems="center" ref={ref} {...props}>
                <Heading as="h2" size="sm" width="100%" textAlign="center">
                    <Text>Comparing </Text>
                    <Flex>
                        <Flex flex="1 0 0px" justifyContent="end">
                            {/* Left half */}
                            <SpecBox packageSpec={a} />
                        </Flex>
                        <Box>
                            {/* Center column */}
                            <Code>...</Code>
                        </Box>
                        <Flex flex="1 0 0px" justifyContent="start">
                            {/* Right half */}
                            <SpecBox packageSpec={b} />
                        </Flex>
                    </Flex>
                </Heading>
                <BorderBox textAlign="center" margin="10px 0">
                    {changedFiles} files with <b>{additions} additions</b> and{" "}
                    <b>{deletions} deletions</b>
                </BorderBox>
            </Flex>
        );
    },
);

export default DiffIntro;
