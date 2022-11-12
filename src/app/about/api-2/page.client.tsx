"use client";
import { Code, Heading, Text, VStack } from "@chakra-ui/react";
import Layout from "^/components/Layout";
import { ExternalLink, Tooltip } from "^/components/theme";

export interface AboutApiPageClientProps {
    diff: string;
    specs: [string, string];
    exampleAbsoluteUrl: string;
}

const AboutApiPageClient = ({
    diff,
    specs,
    exampleAbsoluteUrl,
}: AboutApiPageClientProps) => (
    <Layout title="API">
        <VStack p={5} shadow="md" borderWidth="1px" spacing={8}>
            <Heading as="h2" size="lg">
                npm-diff.app API
            </Heading>
            <Text>
                npm-diff.app exposes a online API to equal{" "}
                <ExternalLink href="https://docs.npmjs.com/cli/v7/commands/npm-diff">
                    <Code>npm diff</Code>
                </ExternalLink>
                , to be able to see the changes between versions of packages or
                forks of packages.
            </Text>

            <Text>
                <Code>
                    GET{" "}
                    <Tooltip label="Click to view the response from the API">
                        <ExternalLink href={exampleAbsoluteUrl}>
                            {exampleAbsoluteUrl}
                        </ExternalLink>
                    </Tooltip>
                </Code>
                <br />
                will return the same as
                <br />
                <Code>
                    npm diff --diff={specs[0]} --diff={specs[1]}
                </Code>
            </Text>
            <Text>
                a <Text as="i">diff</Text> of the two provided packages
            </Text>
            <Code
                as="pre"
                whiteSpace="pre-wrap"
                display={{ base: "none", lg: "initial" }}
            >
                {diff}
            </Code>
        </VStack>
    </Layout>
);

export default AboutApiPageClient;
