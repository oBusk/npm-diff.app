import { withTheme } from "@emotion/react";
import DiffFiles from "components/Diff/DiffFiles";
import Layout from "components/Layout";
import Loading from "components/Loading";
import destination from "lib/destination";
import parseQuery from "lib/query";
import rawQuery from "lib/utils/raw-query";
import setCacheControl from "lib/utils/set-cache-control";
import specsToDiff from "lib/utils/specs-to-diff";
import splitParts from "lib/utils/split-parts";
import libnpmdiff from "libnpmdiff";
import { GetServerSideProps, NextPage } from "next";
import { parseDiff } from "react-diff-view";

type Props = {
    diff: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
    query,
    req,
    res,
}) => {
    const { parts, ...options } = query ?? {};

    const specsOrVersions = splitParts(parts);

    const { redirect, immutableSpecs } = await destination(specsOrVersions);

    if (redirect !== "temporary") {
        setCacheControl(res);
    }

    if (redirect === false) {
        const diff = await libnpmdiff(immutableSpecs, parseQuery(options));

        return {
            props: {
                diff,
            },
        };
    } else {
        return {
            redirect: {
                permanent: redirect === "permanent",
                destination:
                    `/${specsToDiff(immutableSpecs)}` + rawQuery(req, "parts"),
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
