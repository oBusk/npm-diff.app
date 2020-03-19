import { NextPageContext } from "next";
import * as React from "react";
import ReactDiffViewer from "react-diff-viewer";
import Layout from "../components/Layout";
import { getPkgDetails } from "../util/getPkgDetails";
import { fetchTarBall } from "../util/npm-api";
import { parsePackageString } from "../util/npm-parser";

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

function getPackageStrings(queries: string | string[]): [string, string] {
    const query = typeof queries === "string" ? queries : queries[0];

    const [pkg1, pkg2] = query.split("...");

    return [pkg1, pkg2];
}

class DiffPage extends React.Component<Props> {
    static getInitialProps = async ({
        query,
    }: NextPageContext): Promise<Props> => {
        const { slugs } = query;

        const [p1, p2] = getPackageStrings(slugs);

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

        return { p1Result, p2Result };
    };

    render(): JSX.Element {
        const { p1Result, p2Result } = this.props;

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

        const files = [
            ...new Set([
                ...Object.keys(p2Result.files),
                ...Object.keys(p2Result.files),
            ]),
        ];

        return <Layout>{files.map((name: string) => renderFile(name))}</Layout>;
    }
}

export default DiffPage;
