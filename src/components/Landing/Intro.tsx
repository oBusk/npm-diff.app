import { Box, BoxProps, Code, forwardRef, Text } from "@chakra-ui/react";
import { ExternalLink } from "^/components/theme";

export interface IntroProps extends BoxProps {}

const Intro = forwardRef<IntroProps, "div">((props, ref) => (
    <Box {...props} ref={ref}>
        <Text align="center">
            <ExternalLink href="https://docs.npmjs.com/cli/v7/commands/npm-diff">
                <Code>npm diff</Code>
            </ExternalLink>{" "}
            online!
        </Text>
        <Text align="center">
            Web tool to compare versions, or branches, of NPM packages.
        </Text>
    </Box>
));

export default Intro;
