import { withTheme } from "@emotion/react";
import DiffFiles from "components/Diff/DiffFiles";
import Layout from "components/Layout";
import { Loading } from "components/Loading";
import { arrayEquals } from "lib/array-equals";
import { EXAMPLES } from "lib/examples";
import { getAbsoluteSpecs } from "lib/get-absolute-specs";
import { partsToSpecs } from "lib/parts-to-specs";
import libnpmdiff from "libnpmdiff";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import * as React from "react";
import { parseDiff } from "react-diff-view";

type Props = {
    diff: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    const { parts } = params ?? {};

    const specs = partsToSpecs(parts);

    const absoluteSpecs = await getAbsoluteSpecs(specs);

    if (arrayEquals(specs, absoluteSpecs)) {
        const diff = await libnpmdiff(specs);

        return { props: { diff } };
    } else {
        return {
            redirect: {
                destination: `/${absoluteSpecs[0]}...${absoluteSpecs[1]}`,
                // TODO: There are cases where this could be true
                permanent: false,
            },
        };
    }
};

const DiffPage: NextPage<Props> = ({ diff }) => {
    if (!diff) {
        return (
            <Layout>
                <Loading />
            </Layout>
        );
    } else {
        const files = parseDiff(diff);

        return (
            <Layout>
                <DiffFiles files={files} />
            </Layout>
        );
    }
};

export default withTheme(DiffPage);
