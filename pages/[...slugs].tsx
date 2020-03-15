/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { diffLines } from "diff";
import unfetch from "isomorphic-unfetch";
import { NextPageContext } from "next";
import * as React from "react";
import { Diff, DiffFile, Hunk, parseDiff } from "react-diff-view";
import { formatLines } from "unidiff";
import Layout from "../components/Layout";

type Props = {
    packageA?: string;
    packageB?: string;
    diff?: string;
    errors?: string;
};

async function getRedirectOrMeta(
    packageQuery: string,
): Promise<{ status: 302; pkgName: string } | { status: number; json: any }> {
    const url = `https://unpkg.com/${packageQuery}/?meta`;
    const response = await unfetch(url, { redirect: "manual" });
    console.log(response.status);
    if (response.status === 302) {
        const location = response.headers.get("location")!;
        const pkgName = /^https:\/\/unpkg\.com\/(.*)\/\?meta$/.exec(
            location,
        )![1];

        return {
            status: 302,
            pkgName,
        };
    } else {
        const json = await response.json();
        return { status: response.status, json };
    }
}

class DiffPage extends React.Component<Props> {
    static getInitialProps = async ({ query, res }: NextPageContext) => {
        try {
            const { slugs } = query;
            const slug = Array.isArray(slugs) ? slugs.join("/") : slugs;
            const [packageA, packageB] = slug.split("...");
            const [metaOrRedirectA, metaOrRedirectB] = await Promise.all([
                getRedirectOrMeta(packageA),
                getRedirectOrMeta(packageB),
            ]);

            if (
                metaOrRedirectA.status === 302 ||
                metaOrRedirectB.status === 302
            ) {
                const newPackageA =
                    (metaOrRedirectA as any).pkgName ?? packageA;
                const newPackageB =
                    (metaOrRedirectB as any).pkgName ?? packageB;

                // https://spectrum.chat/next-js/general/high-level-301-redirects~669a5349-81c5-441f-a2d8-69d79d5815a8?m=MTU3OTcxNDY3NTk0Mg==
                // use 302 because that's what unpkg does
                res?.writeHead(302, {
                    Location: `${newPackageA}...${newPackageB}`,
                });
                res?.end();
                return {};
            }

            const [aFile, bFile] = await Promise.all([
                unfetch(
                    `https://unpkg.com/${packageA}/package.json`,
                ).then(res => res.text()),
                unfetch(
                    `https://unpkg.com/${packageB}/package.json`,
                ).then(res => res.text()),
            ]);

            const changes = diffLines(aFile, bFile);
            const diff = formatLines(changes, {
                context: Number.MAX_SAFE_INTEGER,
            });

            return { packageA, packageB, diff };
        } catch (err) {
            return { errors: err.message };
        }
    };

    render(): JSX.Element {
        const { errors, diff, packageA, packageB } = this.props;

        if (errors) {
            return (
                <Layout title="Error">
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
            <Layout title={`Comparing ${packageA}...${packageB}`}>
                <div>{files.map(renderFile)}</div>
            </Layout>
        );
    }
}

export default DiffPage;
