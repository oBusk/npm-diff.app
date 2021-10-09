import { ParsedUrlQuery } from "querystring";
import libnpmdiff from "libnpmdiff";
import { GetServerSideProps, NextPage } from "next";
import { parseDiff } from "react-diff-view";
import DiffFiles from "^/components/Diff/DiffFiles";
import DiffIntro from "^/components/DiffIntro";
import Layout from "^/components/Layout";
import bundlephobia, { BundlephobiaResults } from "^/lib/api/bundlephobia";
import packagephobia, { PackagephobiaResults } from "^/lib/api/packagephobia";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import destination from "^/lib/destination";
import DiffOptions from "^/lib/DiffOptions";
import measuredPromise from "^/lib/measuredPromise";
import parseQuery, { QueryParams } from "^/lib/query";
import countChanges from "^/lib/utils/countChanges";
import { setDefaultPageCaching } from "^/lib/utils/headers";
import rawQuery from "^/lib/utils/rawQuery";
import specsToDiff from "^/lib/utils/specsToDiff";
import splitParts from "^/lib/utils/splitParts";

interface Props {
    diff: string;
    specs: [string, string];
    packagephobiaResults: PackagephobiaResults | null;
    bundlephobiaResults: BundlephobiaResults | null;
    options: DiffOptions;
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
    const { diffFiles, ...optionsQuery } = query as QueryParams;

    const specsOrVersions = splitParts(parts);

    const { redirect, immutableSpecs } = await destination(specsOrVersions);

    if (redirect !== "temporary") {
        setDefaultPageCaching(res);
    }

    if (redirect === false) {
        const options = parseQuery({
            // If no diffFiles is passed, use the default.
            // This is done here, since we don't want a fall back in the API
            diffFiles: diffFiles ?? DEFAULT_DIFF_FILES_GLOB,
            ...optionsQuery,
        });

        const [
            { result: diff, time: diffTime },
            { result: packagephobiaResults, time: packagephobiaTime },
            { result: bundlephobiaResults, time: bundlephobiaTime },
        ] = await Promise.all([
            measuredPromise(libnpmdiff(immutableSpecs, options)),
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
                options,
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
    options,
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
                options={options}
                alignSelf="stretch"
            />
            <DiffFiles files={files} />
        </Layout>
    );
};

export default DiffPage;
