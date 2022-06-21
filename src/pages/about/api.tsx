import { Code, Heading, Text, VStack } from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import Layout from "^/components/Layout";
import { ExternalLink, Tooltip } from "^/components/theme";
import destination from "^/lib/destination";
import doDiff from "^/lib/diff";
import EXAMPLES from "^/lib/examples";
import splitParts from "^/lib/utils/splitParts";

// TODO: Would be nice if this was dynamic. But doesn't seem possible
// https://github.com/vercel/next.js/discussions/12848
const API_PATH = `/api` as const;
const EXAMPLE_QUERY = EXAMPLES[0];
const EXAMPLE_RELATIVE_LINK = `${API_PATH}/${EXAMPLE_QUERY}` as const;

const DOMAIN = "https://npm-diff.app";
const EXAMPLE_ABSOLUTE_URL = `${DOMAIN}${EXAMPLE_RELATIVE_LINK}` as const;

type Props = {
    diff: string;
    specs: [string, string];
};

export const getStaticProps: GetStaticProps<Props> = async ({}) => {
    const specsOrVersions = splitParts(EXAMPLE_QUERY);
    const { immutableSpecs } = await destination(specsOrVersions);

    const diff = await doDiff(immutableSpecs, {});

    return { props: { diff, specs: immutableSpecs } };
};

const ApiPage: NextPage<Props> = ({ diff, specs }) => {
    return (
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
                    , to be able to see the changes between versions of packages
                    or forks of packages.
                </Text>

                <Text>
                    <Code>
                        GET{" "}
                        <Tooltip label="Click to view the response from the API">
                            <ExternalLink href={EXAMPLE_ABSOLUTE_URL}>
                                {EXAMPLE_ABSOLUTE_URL}
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
};

export default ApiPage;
