import {
    Box,
    Code,
    Flex,
    forwardRef,
    Heading,
    HeadingProps,
    Icon,
    Link,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { DiNpm } from "react-icons/di";

export interface DiffIntroProps extends HeadingProps {
    a: string;
    b: string;
}

const DiffIntro = forwardRef<DiffIntroProps, "h2">(
    ({ a, b, ...props }, ref) => {
        const [aName, aVersion] = a.split("@");
        const [bName, bVersion] = b.split("@");

        return (
            <Heading as="h2" size="sm" textAlign="center" ref={ref} {...props}>
                <Text>Comparing </Text>
                <Flex>
                    {/* Left */}
                    <Flex justifyContent="end" flex="1 0 0px">
                        <Box>
                            <Code>{a}</Code>
                            <Text>
                                <Tooltip label={`View ${a} on npmjs.com`}>
                                    <Link
                                        href={`https://www.npmjs.com/package/${aName}/v/${aVersion}`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <Icon size="md" as={DiNpm} />
                                    </Link>
                                </Tooltip>
                            </Text>
                        </Box>
                    </Flex>
                    {/* Center */}
                    <Box>
                        <Code>...</Code>
                    </Box>
                    {/* Right */}
                    <Flex justifyContent="start" flex="1 0 0px">
                        <Box>
                            <Code>{b}</Code>
                            <Text>
                                <Tooltip label={`View ${b} on npmjs.com`}>
                                    <Link
                                        href={`https://www.npmjs.com/package/${bName}/v/${bVersion}`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <Icon size="md" as={DiNpm} />
                                    </Link>
                                </Tooltip>
                            </Text>
                        </Box>
                    </Flex>
                </Flex>
            </Heading>
        );
    },
);

export default DiffIntro;
