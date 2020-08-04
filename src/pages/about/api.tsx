import { Heading, Stack, Text, Code, Link } from "@chakra-ui/core";
import Layout from "components/Layout";
import { withTheme } from "emotion-theming";
import { NextPage } from "next";
import { EXAMPLES } from "examples";

const BASE_PATH = "https://package-diff.vercel.app";
const API_PATH = `${BASE_PATH}/api`;
const EXAMPLE_QUERY = EXAMPLES[0];
const EXAMPLE_URL = `${API_PATH}/${EXAMPLE_QUERY}`;

const EXAMPLE_DIFF = `
--- package/LICENSE
+++ package/LICENSE
@@ -1,4 +1,4 @@
-Copyright JS Foundation and other contributors <https://js.foundation/>
+Copyright OpenJS Foundation and other contributors <https://openjsf.org/>

 Based on Underscore.js, copyright Jeremy Ashkenas,
 DocumentCloud and Investigative Reporters & Editors <http://underscorejs.org/>--- package/_baseClone.js
 `;

const ApiPage: NextPage<null> = () => {
    return (
        <Layout>
            <Stack p={5} shadow="md" borderWidth="1px" spacing={8}>
                <Heading as="h2" size="lg">
                    package-diff API
                </Heading>
                <Text>
                    There is a very simple API to get the difference between two
                    versions of a package
                </Text>

                <Code>
                    GET <Link href={EXAMPLE_URL}>{EXAMPLE_URL}</Link>
                </Code>
                <Text>
                    will return a <Text as="i">diff</Text> of the two provided
                    packages
                </Text>
                <Code as="pre">{EXAMPLE_DIFF}</Code>
            </Stack>
        </Layout>
    );
};

export default withTheme(ApiPage);