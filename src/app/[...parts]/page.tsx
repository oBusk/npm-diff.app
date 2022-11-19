import { REDIRECT_ERROR_CODE } from "next/dist/client/components/redirect";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ViewType } from "react-diff-view";
import bundlephobia from "^/lib/api/bundlephobia";
import packagephobia from "^/lib/api/packagephobia";
import TIMED_OUT from "^/lib/api/TimedOut";
import decodePartts from "^/lib/decodeParts";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import destination from "^/lib/destination";
import doDiff, { DiffError } from "^/lib/diff";
import measuredPromise from "^/lib/measuredPromise";
import { parseQuery, QueryParams } from "^/lib/query";
import specsToDiff from "^/lib/utils/specsToDiff";
import splitParts from "^/lib/utils/splitParts";
import { DIFF_TYPE_PARAM_NAME } from "./_page/paramNames";
import DiffPageClient from "./page.client";

// TODO: Don't use the same component for errors and diff page
// TODO: Set title and description using `head.tsx` so that they
//       are set before `useEffect()`
const DiffPage = async ({
    params: { parts },
    searchParams,
}: {
    params: { parts: string | string[] };
    searchParams: QueryParams & { [DIFF_TYPE_PARAM_NAME]: ViewType };
}): Promise<JSX.Element> => {
    try {
        const headersList = headers();
        const { diffFiles, ...optionsQuery } = searchParams;

        const specsOrVersions = splitParts(decodePartts(parts));
        const { redirect: redirectTarget, canonicalSpecs } = await destination(
            specsOrVersions,
        );

        // TODO(#703) - implement correct caching
        // if (redirect !== "temporary") {
        //     setDefaultPageCaching(res);
        // }

        if (redirectTarget === false) {
            const options = parseQuery({
                // If no diffFiles is passed, use the default.
                // This is done here, since we don't want a fall back in the API
                diffFiles: diffFiles ?? DEFAULT_DIFF_FILES_GLOB,
                ...optionsQuery,
            });

            // Start eagerly
            const servicesPromises = Promise.all([
                measuredPromise(packagephobia(canonicalSpecs)),
                measuredPromise(bundlephobia(canonicalSpecs)),
            ]);
            let diff: string = "";
            let diffTime: number = -1;
            try {
                ({ result: diff, time: diffTime } = await measuredPromise(
                    doDiff(canonicalSpecs, options),
                ));
            } catch (e) {
                const { code, error } = e as DiffError;

                // TODO(#703) - statuscode?
                // res.statusCode = code;

                return <DiffPageClient error={error} />;
            }

            let [
                { result: packagephobiaResults, time: packagephobiaTime },
                { result: bundlephobiaResults, time: bundlephobiaTime },
            ] = await servicesPromises;

            if (packagephobiaResults === TIMED_OUT) {
                // If packagephobia timed out, we don't want to cache forever, instead use SWR caching
                // TODO(#703) - implement correct caching
                // setSwrCaching(res);
                packagephobiaResults = null;
            }

            if (bundlephobiaResults === TIMED_OUT) {
                // If bundlephobia timed out, we don't want to cache forever, instead use SWR cachin
                // TODO(#703) - implement correct caching
                // setSwrCaching(res);
                bundlephobiaResults = null;
            }

            console.log({
                specs: canonicalSpecs,
                timings: {
                    diff: diffTime,
                    packagephobia: packagephobiaTime,
                    bundlephobia: bundlephobiaTime,
                },
                caching: headersList.get("Cache-Control"),
            });

            return (
                <DiffPageClient
                    result={{
                        specs: canonicalSpecs,
                        diff,
                        packagephobiaResults,
                        bundlephobiaResults,
                        options,
                    }}
                />
            );
        } else {
            // return {
            //     redirect: {
            //         permanent: redirect === "permanent",
            //         destination:
            //             `/${specsToDiff(canonicalSpecs)}` +
            //             rawQuery(req, "parts"),
            //     },
            // };
            // TODO(#703) How to do permanent?
            redirect(
                `/${specsToDiff(canonicalSpecs)}?${Object.entries(searchParams)
                    .map(([key, value]) => `${key}=${value}`)
                    .join("&")}`,
            );
        }
    } catch (e: any) {
        if (e.digest?.startsWith(REDIRECT_ERROR_CODE)) {
            // We need to propagate the error to the worker
            throw e;
        }
        return <DiffPageClient error={e?.message ?? e ?? "Unknown error"} />;
    }
};

export default DiffPage;
