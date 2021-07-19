import { Code, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { withTheme } from "@emotion/react";
import Layout from "components/Layout";
import { EXAMPLES } from "lib/examples";
import { npmDiff } from "lib/npm-diff";
import { partsToSpecs } from "lib/parts-to-specs";
import { GetStaticProps, NextPage } from "next";

// TODO: Would be nice if this was dynamic. But doesn't seem possible
// https://github.com/vercel/next.js/discussions/12848
const BASE_PATH = "https://npm-diff.app";
const API_PATH = `${BASE_PATH}/api`;
const EXAMPLE_QUERY = EXAMPLES[0];
const EXAMPLE_URL = `${API_PATH}/${EXAMPLE_QUERY}`;

type Props = {
    diff: string;
    specs: [string, string];
};

export const getStaticProps: GetStaticProps<Props> = async ({}) => {
    const specs = partsToSpecs(EXAMPLE_QUERY);
    const diff = await npmDiff(specs);

    return { props: { diff, specs } };
};

const ApiPage: NextPage<Props> = ({ diff, specs }) => {
    return (
        <Layout>
            <VStack p={5} shadow="md" borderWidth="1px" spacing={8}>
                <Heading as="h2" size="lg">
                    npm-diff.app API
                </Heading>
                <Text>
                    npm-diff.app exposes a online API to equal{" "}
                    <Code>npm diff</Code>, to be able to see the changes between
                    versions of packages or forks of packages.
                </Text>

                <Text>
                    <Code>
                        GET <Link href={EXAMPLE_URL}>{EXAMPLE_URL}</Link>
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
                <Code as="pre" whiteSpace="pre-wrap">
                    {diff}
                </Code>
            </VStack>
        </Layout>
    );
};

export default withTheme(ApiPage);
