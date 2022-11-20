import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ViewType } from "react-diff-view";
import decodePartts from "^/lib/decodeParts";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import destination from "^/lib/destination";
import parseSimplePackageSpec from "^/lib/parseSimplePackageSpec";
import { parseQuery, QueryParams } from "^/lib/query";
import specsToDiff from "^/lib/utils/specsToDiff";
import splitParts from "^/lib/utils/splitParts";
import BundlephobiaDiff from "./_page/BundlephobiaDiff";
import NpmDiff from "./_page/NpmDiff/NpmDiff";
import PackagephobiaDiff from "./_page/PackagephobiaDiff";
import { DIFF_TYPE_PARAM_NAME } from "./_page/paramNames";
import DiffPageClient from "./page.client";

// TODO: Set title and description using `head.tsx` so that they
//       are set before `useEffect()`
const DiffPage = async ({
    params: { parts },
    searchParams,
}: {
    params: { parts: string | string[] };
    searchParams: QueryParams & { [DIFF_TYPE_PARAM_NAME]: ViewType };
}): Promise<JSX.Element> => {
    const { diffFiles, ...optionsQuery } = searchParams;

    const specsOrVersions = splitParts(decodePartts(parts));
    const { redirect: redirectTarget, canonicalSpecs } = await destination(
        specsOrVersions,
    );

    if (redirectTarget !== false) {
        redirect(
            `/${specsToDiff(canonicalSpecs)}?${Object.entries(searchParams)
                // On vercel, the redirect added "parts=..." to the query
                // I suspect it's because it appears as searchParams for
                // some reason
                .filter(([key]) => key !== "parts")
                .map(([key, value]) => `${key}=${value}`)
                .join("&")}`,
        );
    } else {
        const options = parseQuery({
            // If no diffFiles is passed, use the default.
            // This is done here, since we don't want a fall back in the API
            diffFiles: diffFiles ?? DEFAULT_DIFF_FILES_GLOB,
            ...optionsQuery,
        });

        const [a, b] = canonicalSpecs.map((spec) =>
            parseSimplePackageSpec(spec),
        );

        return (
            <DiffPageClient
                a={a}
                b={b}
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
                diffResults={
                    <Suspense>
                        {/* @ts-expect-error Server Component */}
                        <NpmDiff
                            a={a}
                            b={b}
                            specs={canonicalSpecs}
                            options={options}
                        />
                    </Suspense>
                }
            />
        );
    }
};

export default DiffPage;
