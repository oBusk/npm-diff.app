import { withTheme } from "@emotion/react";
import DiffFiles from "components/Diff/DiffFiles";
import Layout from "components/Layout";
import { Loading } from "components/Loading";
import destination from "lib/destination";
import { EXAMPLES } from "lib/examples";
import parseQuery from "lib/parse-query";
import specsToDiff from "lib/specs-to-diff";
import splitParts from "lib/split-parts";
import libnpmdiff from "libnpmdiff";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import querystring from "querystring";
import * as React from "react";
import { parseDiff } from "react-diff-view";

type Props = {
    diff: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
    const exampleSpecsOrVersions = EXAMPLES.map(splitParts);
    const exampleDestinations = await Promise.all(
        exampleSpecsOrVersions.map(destination),
    );

    return {
        paths: exampleDestinations.map(({ immutableSpecs }) => ({
            params: { parts: [specsToDiff(immutableSpecs)] },
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

    const { redirect, immutableSpecs: specs } = await destination(
        specsOrVersions,
    );

    if (redirect === false) {
        const diff = await libnpmdiff(
            specs,
            parseQuery({
                diffNameOnly,
                diffUnified,
                diffIgnoreAllSpace,
                diffNoPrefix,
                diffSrcPrefix,
                diffDstPrefix,
                diffText,
            }),
        );

        return {
            props: {
                diff,
            },
        };
    } else {
        return {
            redirect: {
                destination: `/${specsToDiff(specs)}?${querystring.stringify({
                    diffNameOnly,
                    diffUnified,
                    diffIgnoreAllSpace,
                    diffNoPrefix,
                    diffSrcPrefix,
                    diffDstPrefix,
                    diffText,
                })}`,
                permanent: redirect === "permanent",
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
