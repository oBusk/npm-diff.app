import Layout from "components/Layout";
import { Loading } from "components/Loading";
import { withTheme } from "emotion-theming";
import { EXAMPLES } from "examples";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import * as React from "react";
import ReactDiffViewer from "react-diff-viewer";
import { getPkgDetails } from "util/getPkgDetails";
import { fetchTarBall } from "util/npm-api";
import { parsePackageString } from "util/npm-parser";

type Props = {
    p1Result: {
        files: { [n: string]: string };
        version: string;
    };
    p2Result: {
        files: { [n: string]: string };
        version: string;
    };
};

function getPackageStrings(parts: string | string[]): [string, string] {
    const query = typeof parts === "string" ? parts : parts.join("/");

    const [pkg1, pkg2] = query.split("...");

    return [pkg1, pkg2];
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: EXAMPLES.map((ex) => ({ params: { parts: [ex] } })),
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    const { parts = "" } = params ?? {};

    const [p1, p2] = getPackageStrings(parts);

    const p1StringParse = parsePackageString(p1);
    const p2StringParse = parsePackageString(p2);

    const p1DetailsPromise = getPkgDetails(
        p1StringParse.name,
        p1StringParse.versionOrTag,
    );
    const p2DetailsPromise = getPkgDetails(
        p2StringParse.name,
        p2StringParse.versionOrTag,
    );

    const p1FilesPromise = p1DetailsPromise.then(({ tarballUrl }) =>
        fetchTarBall(tarballUrl),
    );
    const p2FilesPromise = p2DetailsPromise.then(({ tarballUrl }) =>
        fetchTarBall(tarballUrl),
    );

    const p1Result = {
        files: await p1FilesPromise,
        version: (await p1DetailsPromise).version,
    };
    const p2Result = {
        files: await p2FilesPromise,
        version: (await p2DetailsPromise).version,
    };

    return { props: { p1Result, p2Result } };
};

const DiffPage: NextPage<Props> = ({ p1Result, p2Result }) => {
    if (!p1Result || !p2Result) {
        return (
            <Layout>
                <Loading />
            </Layout>
        );
    }

    const renderFile = (fileName: string): JSX.Element => (
        <ReactDiffViewer
            key={fileName}
            oldValue={p1Result.files[fileName] || ""}
            leftTitle={fileName + "@" + p1Result.version}
            newValue={p2Result.files[fileName] || ""}
            rightTitle={fileName + "@" + p2Result.version}
            useDarkTheme={true}
        />
    );

    const files = Array.from(
        new Set([
            ...Object.keys(p1Result.files),
            ...Object.keys(p2Result.files),
        ]),
    );

    return <Layout>{files.map((name: string) => renderFile(name))}</Layout>;
};

export default withTheme(DiffPage);
