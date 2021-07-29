import { Code, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

const Intro: FunctionComponent<{}> = () => (
    <Text align="center">
        <a
            href="https://docs.npmjs.com/cli/v7/commands/npm-diff"
            rel="noopener noreferrer"
        >
            <Code>npm diff</Code>
        </a>{" "}
        online!
        <br />
        Web tool to compare versions, or branches, of NPM packages.
    </Text>
);

export default Intro;
