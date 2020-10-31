import DiffFiles from "components/Diff/DiffFiles";
import Layout from "components/Layout";
import { Loading } from "components/Loading";
import { withTheme } from "emotion-theming";
import { EXAMPLES } from "examples";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import * as React from "react";
import { parseDiff } from "react-diff-view";
import { queryToDiff } from "util/query-to-diff";

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
    const { parts = "" } = params ?? {};

    const diff = await queryToDiff(parts);

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
