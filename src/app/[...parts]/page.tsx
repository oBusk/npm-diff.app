import { headers } from "next/headers";
import { redirect } from "next/navigation";
import npa from "npm-package-arg";
import { Suspense } from "react";
import { ViewType } from "react-diff-view";
import decodePartts from "^/lib/decodeParts";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import destination from "^/lib/destination";
import doDiff from "^/lib/diff";
import measuredPromise from "^/lib/measuredPromise";
import { parseQuery, QueryParams } from "^/lib/query";
import specsToDiff from "^/lib/utils/specsToDiff";
import splitParts from "^/lib/utils/splitParts";
import BundlephobiaDiff from "./_page/BundlephobiaDiff";
import PackagephobiaDiff from "./_page/PackagephobiaDiff";
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

        let diff: string = "";
        let diffTime: number = -1;

        // try {
        ({ result: diff, time: diffTime } = await measuredPromise(
            doDiff(canonicalSpecs, options),
        ));
        // } catch (e) {
        //     const { code, error } = e as DiffError;

        //     // TODO(#703) - statuscode?
        //     // res.statusCode = code;

        //     return <DiffPageClient error={error} />;
        // }

        console.log({
            specs: canonicalSpecs,
            timings: {
                diff: diffTime,
            },
            caching: headersList.get("Cache-Control"),
        });

        const aNpa = npa(canonicalSpecs[0]);
        const a = {
            name: aNpa.name!,
            version: aNpa.rawSpec!,
        };
        const bNpa = npa(canonicalSpecs[1]);
        const b = {
            name: bNpa.name!,
            version: bNpa.rawSpec!,
        };

        return (
            <DiffPageClient
                specs={canonicalSpecs}
                diff={diff}
                options={options}
                services={
                    <>
                        <Suspense>
                            {/* @ts-expect-error Server Component */}
                            <BundlephobiaDiff
                                a={a}
                                b={b}
                                specs={canonicalSpecs}
                            />
                        </Suspense>
                        <Suspense>
                            {/* @ts-expect-error Server Component */}
                            <PackagephobiaDiff
                                a={a}
                                b={b}
                                specs={canonicalSpecs}
                            />
                        </Suspense>
                    </>
                }
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
                // On vercel, the redirect added "parts=..." to the query
                // I suspect it's because it appears as searchParams for
                // some reason
                .filter(([key]) => key !== "parts")
                .map(([key, value]) => `${key}=${value}`)
                .join("&")}`,
        );
    }
};

export default DiffPage;
