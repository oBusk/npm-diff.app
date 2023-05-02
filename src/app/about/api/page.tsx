import type { Metadata } from "next";
import ExternalLink from "^/components/ExternalLink";
import Code from "^/components/ui/Code";
import Heading from "^/components/ui/Heading";
import Stack from "^/components/ui/Stack";
import Tooltip from "^/components/ui/Tooltip";
import cn from "^/lib/cn";
import destination from "^/lib/destination";
import EXAMPLES from "^/lib/examples";
import npmDiff from "^/lib/npmDiff";
import splitParts from "^/lib/utils/splitParts";

// TODO: Would be nice if this was dynamic. But doesn't seem possible
// https://github.com/vercel/next.js/discussions/12848
const API_PATH = `/api` as const;
const EXAMPLE_QUERY = EXAMPLES[0];
const EXAMPLE_RELATIVE_LINK = `${API_PATH}/${EXAMPLE_QUERY}` as const;

const DOMAIN = "https://npm-diff.app";
const EXAMPLE_ABSOLUTE_URL = `${DOMAIN}${EXAMPLE_RELATIVE_LINK}` as const;

export const metadata = {
    title: "API",
    description: "API documentation for npm-diff.app",
} satisfies Metadata;

// We need nodejs since we use Npm libs https://beta.nextjs.org/docs/api-reference/segment-config#runtime
export const runtime = "nodejs";
const AboutApiPage = async () => {
    const specsOrVersions = splitParts(EXAMPLE_QUERY);
    const { canonicalSpecs: specs } = await destination(specsOrVersions);

    const diff = await npmDiff(specs, {});

    return (
        <Stack align="center" gap={8} className={cn("border p-5")}>
            <Heading>npm-diff.app API</Heading>
            <p>
                npm-diff.app exposes a online API to equal{" "}
                <ExternalLink href="https://docs.npmjs.com/cli/v7/commands/npm-diff">
                    <Code>npm diff</Code>
                </ExternalLink>
                , to be able to see the changes between versions of packages or
                forks of packages.
            </p>

            <p>
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
            </p>

            <p>
                a <i>diff</i> of the two provided packages
            </p>
            <Code variant="block">{diff}</Code>
        </Stack>
    );
};

export default AboutApiPage;
