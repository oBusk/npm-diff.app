import { withTheme } from "@emotion/react";
import DiffFiles from "components/Diff/DiffFiles";
import DiffIntro from "components/DiffIntro";
import Layout from "components/Layout";
import destination from "lib/destination";
import parseQuery from "lib/query";
import rawQuery from "lib/utils/rawQuery";
import setCacheControl from "lib/utils/setCacheControl";
import specsToDiff from "lib/utils/specsToDiff";
import splitParts from "lib/utils/splitParts";
import libnpmdiff from "libnpmdiff";
import { GetServerSideProps, NextPage } from "next";
import { parseDiff } from "react-diff-view";

type Props = {
    diff: string;
    specs: [string, string];
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
                specs: immutableSpecs,
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

const DiffPage: NextPage<Props> = ({ diff, specs: [a, b] }) => {
    const files = parseDiff(diff);

    return (
        <Layout title={`Comparing ${a}...${b}`}>
            <DiffIntro a={a} b={b} alignSelf="stretch" />
            <DiffFiles files={files} />
        </Layout>
    );
};

export default withTheme(DiffPage);
