import { withTheme } from "@emotion/react";
import DiffFiles from "components/Diff/DiffFiles";
import Layout from "components/Layout";
import { Loading } from "components/Loading";
import { EXAMPLES } from "lib/examples";
import { npmDiff } from "lib/npm-diff";
import { partsToSpecs } from "lib/parts-to-specs";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import * as React from "react";
import { parseDiff } from "react-diff-view";

type Props = {
    diff: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: EXAMPLES.map((ex) => ({ params: { parts: [ex] } })),
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    const { parts } = params ?? {};

    const specs = partsToSpecs(parts);
    const diff = await npmDiff(specs);

    return { props: { diff } };
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
