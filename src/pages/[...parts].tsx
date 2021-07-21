import { withTheme } from "@emotion/react";
import DiffFiles from "components/Diff/DiffFiles";
import Layout from "components/Layout";
import { Loading } from "components/Loading";
import { EXAMPLES } from "lib/examples";
import getAbsoluteSpecs from "lib/get-absolute-specs";
import npmDiff from "lib/npm-diff";
import splitParts from "lib/split-parts";
import { versionsToSpecs } from "lib/versions-to-specs";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import querystring from "querystring";
import * as React from "react";
import { parseDiff } from "react-diff-view";

type Props = {
    diff: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
    const examplesSpecsOrVersions = EXAMPLES.map(splitParts);
    const examplesSpecs = examplesSpecsOrVersions.map(versionsToSpecs);
    const immutableSpecs = await Promise.all(
        examplesSpecs.map(getAbsoluteSpecs),
    );

    return {
        paths: immutableSpecs.map(([a, b]) => ({
            params: { parts: [`${a}...${b}`] },
        })),

        fallback: true,
    };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    const {
        parts,
        diffNameOnly,
        diffUnified,
        diffIgnoreAllSpace,
        diffNoPrefix,
        diffSrcPrefix,
        diffDstPrefix,
        diffText,
    } = params ?? {};

    const specsOrVersions = splitParts(parts);

    const result = await npmDiff(specsOrVersions, {
        diffNameOnly,
        diffUnified,
        diffIgnoreAllSpace,
        diffNoPrefix,
        diffSrcPrefix,
        diffDstPrefix,
        diffText,
    });

    if (result.type === "redirect") {
        return {
            redirect: {
                destination: `/${
                    result.destinationDiff
                }?${querystring.stringify({
                    diffNameOnly,
                    diffUnified,
                    diffIgnoreAllSpace,
                    diffNoPrefix,
                    diffSrcPrefix,
                    diffDstPrefix,
                    diffText,
                })}`,
                permanent: result.permanent,
            },
        };
    } else {
        return {
            props: {
                diff: result.diff,
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
