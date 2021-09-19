import DiffFiles from "components/Diff/DiffFiles";
import DiffIntro from "components/DiffIntro";
import Layout from "components/Layout";
import { bundlephobia, BundlephobiaResults } from "lib/bundlephobia";
import { DEFAULT_DIFF_FILES_GLOB } from "lib/default-diff-files";
import destination from "lib/destination";
import measuredPromise from "lib/measuredPromise";
import { packagephobia, PackagephobiaResults } from "lib/packagephobia";
import parseQuery, { QueryParams } from "lib/query";
import countChanges from "lib/utils/countChanges";
import rawQuery from "lib/utils/rawQuery";
import setCacheControl from "lib/utils/setCacheControl";
import specsToDiff from "lib/utils/specsToDiff";
import splitParts from "lib/utils/splitParts";
import libnpmdiff from "libnpmdiff";
import { GetServerSideProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { parseDiff } from "react-diff-view";

interface Props {
    diff: string;
    specs: [string, string];
    packagephobiaResults: PackagephobiaResults | null;
    bundlephobiaResults: BundlephobiaResults | null;
}

interface Params extends ParsedUrlQuery {
    parts: string | string[];
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
    params: { parts } = {},
    query = {},
    req,
    res,
}) => {
    const { diffFiles, ...options } = query as QueryParams;

    const specsOrVersions = splitParts(parts);

    const { redirect, immutableSpecs } = await destination(specsOrVersions);

    if (redirect !== "temporary") {
        setCacheControl(res);
    }

    if (redirect === false) {
        const [
            { result: diff, time: diffTime },
            { result: packagephobiaResults, time: packagephobiaTime },
            { result: bundlephobiaResults, time: bundlephobiaTime },
        ] = await Promise.all([
            measuredPromise(
                libnpmdiff(
                    immutableSpecs,
                    parseQuery({
                        // If no diffFiles is passed, use the default.
                        // This is done here, since we don't want a fall back in the API
                        diffFiles: diffFiles ?? DEFAULT_DIFF_FILES_GLOB,
                        ...options,
                    }),
                ),
            ),
            measuredPromise(packagephobia(immutableSpecs)),
            measuredPromise(bundlephobia(immutableSpecs)),
        ]);

        console.log({
            specs: immutableSpecs,
            timings: {
                diff: diffTime,
                packagephobia: packagephobiaTime,
                bundlephobia: bundlephobiaTime,
            },
        });

        return {
            props: {
                specs: immutableSpecs,
                diff,
                packagephobiaResults,
                bundlephobiaResults,
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
    bundlephobiaResults,
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
                bundlephobiaResults={bundlephobiaResults}
                alignSelf="stretch"
            />
            <DiffFiles files={files} />
        </Layout>
    );
};

export default DiffPage;
