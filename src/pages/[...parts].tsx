import Layout from "components/Layout";
import { Loading } from "components/Loading";
import { withTheme } from "emotion-theming";
import { EXAMPLES } from "examples";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { queryToDiff } from "util/query-to-diff";
import * as React from "react";
import {
    Decoration,
    Diff,
    DiffFile,
    Hunk,
    HunkData,
    parseDiff,
} from "react-diff-view";

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
    }

    const files = parseDiff(diff);

    const renderHunk = (hunk: HunkData) => [
        <Decoration key={"decoration-" + hunk.content}>
            {hunk.content}
        </Decoration>,
        <Hunk key={"hunk-" + hunk.content} hunk={hunk}></Hunk>,
    ];

    const renderFile = ({
        oldRevision,
        newRevision,
        type,
        hunks,
    }: DiffFile): JSX.Element => {
        return (
            <Diff
                key={oldRevision + "-" + newRevision}
                viewType="split"
                diffType={type}
                hunks={hunks}
            >
                {(hunks: HunkData[]): JSX.Element[][] => hunks.map(renderHunk)}
            </Diff>
        );
    };

    return (
        <Layout>
            <div>{files.map(renderFile)}</div>
        </Layout>
    );
};

export default withTheme(DiffPage);
