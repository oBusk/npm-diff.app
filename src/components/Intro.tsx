import { Code, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import ExternalLink from "./theme/ExternalLink";

const Intro: FunctionComponent<{}> = () => (
    <>
        <Text align="center">
            <ExternalLink href="https://docs.npmjs.com/cli/v7/commands/npm-diff">
                <Code>npm diff</Code>
            </ExternalLink>{" "}
            online!
        </Text>
        <Text>Web tool to compare versions, or branches, of NPM packages.</Text>
    </>
);

export default Intro;
