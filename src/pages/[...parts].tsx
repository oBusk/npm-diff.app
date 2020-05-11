import Layout from "components/Layout";
import { Loading } from "components/Loading";
import { withTheme } from "emotion-theming";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import * as React from "react";
import { Decoration, Diff, DiffFile, Hunk, parseDiff } from "react-diff-view";
import { getDiff } from "util/getDiff";
import { getPkgDetails } from "util/getPkgDetails";
import { fetchTarBall } from "util/npm-api";
import { parsePackageString } from "util/npm-parser";

type Props = {
    diff: string;
};

function getPackageStrings(parts: string | string[]): [string, string] {
    const query = typeof parts === "string" ? parts : parts.join("/");

    const [pkg1, pkg2] = query.split("...");

    return [pkg1, pkg2];
}

export const getStaticPaths: GetStaticPaths = async () => {
    return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    const { parts = "" } = params ?? {};

    const [p1, p2] = getPackageStrings(parts);

    const p1StringParse = parsePackageString(p1);
    const p2StringParse = parsePackageString(p2);

    const [p1Details, p2Details] = await Promise.all([
        getPkgDetails(p1StringParse.name, p1StringParse.versionOrTag),
        getPkgDetails(p2StringParse.name, p2StringParse.versionOrTag),
    ]);

    const [p1Files, p2Files] = await Promise.all([
        fetchTarBall(p1Details.tarballUrl),
        fetchTarBall(p2Details.tarballUrl),
    ]);

    const p1Result = {
        files: p1Files,
        version: p1Details.version,
    };
    const p2Result = {
        files: p2Files,
        version: p2Details.version,
    };

    const diff = getDiff(p1Result.files, p2Result.files);

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

    const renderHunk = (hunk: any) => [
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
                {(hunks: any[]): JSX.Element[][] => hunks.map(renderHunk)}
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
