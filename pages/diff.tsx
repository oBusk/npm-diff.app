/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import fetch from "isomorphic-unfetch";
import * as React from "react";
import { Diff, Hunk, parseDiff, DiffFile } from "react-diff-view";
import { diffLines } from "diff";
import Layout from "../components/Layout";
import { formatLines } from "unidiff";
import { NextPageContext } from "next";

type Props = {
    diff?: string;
    errors?: string;
};

class DiffPage extends React.Component<Props> {
    static getInitialProps = async ({ query }: NextPageContext) => {
        try {
            const { a, b } = query;
            console.log({ a, b });
            const [aFile, bFile] = await Promise.all([
                fetch(Array.isArray(a) ? a[0] : a).then(res => res.text()),
                fetch(Array.isArray(b) ? b[0] : b).then(res => res.text()),
            ]);

            const changes = diffLines(aFile, bFile);
            const diff = formatLines(changes, {
                context: Number.MAX_SAFE_INTEGER,
            });

            return { diff };
        } catch (err) {
            return { errors: err.message };
        }
    };

    render(): JSX.Element {
        const { errors, diff } = this.props;

        if (errors) {
            return (
                <Layout>
                    <p>
                        <span style={{ color: "red" }}>Error:</span> {errors}
                    </p>
                </Layout>
            );
        }

        const files = parseDiff(diff!);

        const renderFile = ({
            oldRevision,
            newRevision,
            type,
            hunks,
        }: DiffFile) => {
            return (
                <Diff
                    key={oldRevision + "-" + newRevision}
                    viewType="split"
                    diffType={type}
                    hunks={hunks}
                >
                    {(hunks: any) =>
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
