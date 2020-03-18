import { NextPageContext } from "next";
import * as React from "react";
import { getPkgDetails } from "../util/getPkgDetails";
import { parsePackageString } from "../util/npm-parser";
import { fetchTarBall } from "../util/npm-api";
import { getDiff } from "../util/getDiff";
import Layout from "../components/Layout";
import { Diff, DiffFile, Hunk, parseDiff } from "react-diff-view";

type Props = {
    diff: string;
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

        const diff = getDiff(p1Result.files, p2Result.files);

        return { diff };
    };

    render(): JSX.Element {
        const { diff } = this.props;

        const files = parseDiff(diff);

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
                    {(hunks: any): JSX.Element =>
                        hunks.map((hunk: any) => (
                            <Hunk key={hunk.content} hunk={hunk} />
                        ))
                    }
                </Diff>
            );
        };

        return (
            <Layout>
                <div>{files.map(renderFile)}</div>
            </Layout>
        );
    }
}

export default DiffPage;
