import { withTheme } from "@emotion/react";
import DiffFiles from "components/Diff/DiffFiles";
import DiffIntro from "components/DiffIntro";
import Layout from "components/Layout";
import destination from "lib/destination";
import { packagephobia, PackagephobiaResults } from "lib/packagephobia";
import parseQuery from "lib/query";
import countChanges from "lib/utils/countChanges";
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
    packagephobiaResults: PackagephobiaResults;
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
        const [diff, packagephobiaResults] = await Promise.all([
            libnpmdiff(immutableSpecs, parseQuery(options)),
            packagephobia(immutableSpecs),
        ]);

        return {
            props: {
                specs: immutableSpecs,
                diff,
                packagephobiaResults,
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

const DiffPage: NextPage<Props> = ({
    diff,
    specs: [a, b],
    packagephobiaResults,
}) => {
    const files = parseDiff(diff);

    const changedFiles = files.length;

    const changes = files.map((file) => countChanges(file.hunks));
    const additions = changes
        .map(({ additions }) => additions)
        .reduce((a, b) => a + b);
    const deletions = changes
        .map(({ deletions }) => deletions)
        .reduce((a, b) => a + b);

    return (
        <Layout title={`Comparing ${a}...${b}`}>
            <DiffIntro
                a={a}
                b={b}
                changedFiles={changedFiles}
                additions={additions}
                deletions={deletions}
                packagephobiaResults={packagephobiaResults}
                alignSelf="stretch"
            />
            <DiffFiles files={files} />
        </Layout>
    );
};

export default withTheme(DiffPage);
