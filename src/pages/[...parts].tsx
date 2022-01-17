import { Center } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { parseDiff } from "react-diff-view";
import DiffFiles from "^/components/Diff/DiffFiles";
import DiffIntro from "^/components/DiffIntro";
import ErrorBox from "^/components/ErrorBox";
import Layout from "^/components/Layout";
import bundlephobia, { BundlephobiaResults } from "^/lib/api/bundlephobia";
import packagephobia, { PackagephobiaResults } from "^/lib/api/packagephobia";
import TIMED_OUT from "^/lib/api/TimedOut";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import destination from "^/lib/destination";
import doDiff, { DiffError } from "^/lib/diff";
import DiffOptions from "^/lib/DiffOptions";
import measuredPromise from "^/lib/measuredPromise";
import { parseQuery, QueryParams, rawQuery } from "^/lib/query";
import countChanges from "^/lib/utils/countChanges";
import { setDefaultPageCaching, setSwrCaching } from "^/lib/utils/headers";
import specsToDiff from "^/lib/utils/specsToDiff";
import splitParts from "^/lib/utils/splitParts";

type Props = {
    error?: string;
    result?: {
        diff: string;
        specs: [string, string];
        packagephobiaResults: PackagephobiaResults | null;
        bundlephobiaResults: BundlephobiaResults | null;
        options: DiffOptions;
    };
};

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

        // Start eagerly
        const servicesPromises = Promise.all([
            measuredPromise(packagephobia(immutableSpecs)),
            measuredPromise(bundlephobia(immutableSpecs)),
        ]);
        let diff: string = "";
        let diffTime: number = -1;
        try {
            ({ result: diff, time: diffTime } = await measuredPromise(
                doDiff(immutableSpecs, options),
            ));
        } catch (e) {
            const { code, error } = e as DiffError;

            res.statusCode = code;

            return {
                props: {
                    error,
                },
            };
        }

        let [
            { result: packagephobiaResults, time: packagephobiaTime },
            { result: bundlephobiaResults, time: bundlephobiaTime },
        ] = await servicesPromises;

        if (packagephobiaResults === TIMED_OUT) {
            // If packagephobia timed out, we don't want to cache forever, instead use SWR caching
            setSwrCaching(res);
            packagephobiaResults = null;
        }

        if (bundlephobiaResults === TIMED_OUT) {
            // If bundlephobia timed out, we don't want to cache forever, instead use SWR cachin
            setSwrCaching(res);
            bundlephobiaResults = null;
        }

        console.log({
            specs: immutableSpecs,
            timings: {
                diff: diffTime,
                packagephobia: packagephobiaTime,
                bundlephobia: bundlephobiaTime,
            },
            caching: res.getHeader("Cache-Control"),
        });

        return {
            props: {
                result: {
                    specs: immutableSpecs,
                    diff,
                    packagephobiaResults,
                    bundlephobiaResults,
                    options,
                },
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

const DiffPage: NextPage<Props> = ({ error, result }) => {
    if (error != null) {
        return (
            <Layout>
                <Center>
                    <ErrorBox>{error}</ErrorBox>
                </Center>
            </Layout>
        );
    }

    const {
        diff,
        specs: [a, b],
        packagephobiaResults,
        bundlephobiaResults,
        options,
    } = result!;

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
        <Layout
            title={`Comparing ${a}...${b}`}
            description={`A diff between the npm packages "${a}" and "${b}"`}
        >
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
