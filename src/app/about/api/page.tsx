import type { Metadata } from "next";
import destination from "^/lib/destination";
import doDiff from "^/lib/diff";
import EXAMPLES from "^/lib/examples";
import splitParts from "^/lib/utils/splitParts";
import AboutApiPageClient from "./page.client";

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
    const { canonicalSpecs } = await destination(specsOrVersions);

    const diff = await doDiff(canonicalSpecs, {});

    return (
        <AboutApiPageClient
            diff={diff}
            specs={canonicalSpecs}
            exampleAbsoluteUrl={EXAMPLE_ABSOLUTE_URL}
        />
    );
};

export default AboutApiPage;
