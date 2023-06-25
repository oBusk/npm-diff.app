import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ViewType } from "react-diff-view";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import destination from "^/lib/destination";
import { parseQuery, QueryParams } from "^/lib/query";
import { createSimplePackageSpec } from "^/lib/SimplePackageSpec";
import decodeParts from "^/lib/utils/decodeParts";
import specsToDiff from "^/lib/utils/specsToDiff";
import splitParts from "^/lib/utils/splitParts";
import BundlephobiaDiff, {
    BundlephobiaDiffSkeleton,
} from "./_page/BundlephobiaDiff";
import DiffIntro from "./_page/DiffIntro";
import NpmDiff from "./_page/NpmDiff/NpmDiff";
import NpmDiffSkeleton from "./_page/NpmDiff/NpmDiff.skeleton";
import PackagephobiaDiff, {
    PackagephobiaDiffSkeleton,
} from "./_page/PackagephobiaDiff";
import { DIFF_TYPE_PARAM_NAME } from "./_page/paramNames";

export interface DiffPageProps {
    params: { parts: string | string[] };
    searchParams: QueryParams & { [DIFF_TYPE_PARAM_NAME]: ViewType };
}

export function generateMetadata({ params: { parts } }: DiffPageProps) {
    const specs = splitParts(decodeParts(parts));

    const [a, b] = specs.map((spec) => createSimplePackageSpec(spec));

    return {
        title: `Comparing ${a.name}@${a.version}...${b.name}@${b.version}`,
        description: `A diff between the npm packages "${a.name}@${a.version}" and "${b.name}@${b.version}"`,
    };
}

// So while it would be super cool to have a dynamic page with cached data to
// have the fancy Suspense loading, there's no data caching for third party
// data, only for `fetch()` calls. So if we don't want to redo the diff for
// every page load, we need to have a static page.
// https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration
export const dynamic = "force-static";

const DiffPage = async ({
    params: { parts },
    searchParams,
}: DiffPageProps): Promise<JSX.Element> => {
    const { diffFiles, ...optionsQuery } = searchParams;

    const specsOrVersions = splitParts(decodeParts(parts));
    const { redirect: redirectTarget, canonicalSpecs } = await destination(
        specsOrVersions,
    );

    if (redirectTarget !== false) {
        const specsStr = specsToDiff(canonicalSpecs);
        const searchStr = Object.entries(searchParams)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");

        redirect(
            `/${specsStr}` + (searchStr?.length > 0 ? `?${searchStr}` : ""),
        );
    } else {
        const options = parseQuery({
            // If no diffFiles is passed, use the default.
            // This is done here, since we don't want a fall back in the API
            diffFiles: diffFiles ?? DEFAULT_DIFF_FILES_GLOB,
            ...optionsQuery,
        });

        const [a, b] = canonicalSpecs.map((spec) =>
            createSimplePackageSpec(spec),
        );

        return (
            <>
                <DiffIntro
                    alignSelf="stretch"
                    a={a}
                    b={b}
                    services={
                        <>
                            <Suspense fallback={<BundlephobiaDiffSkeleton />}>
                                <BundlephobiaDiff
                                    a={a}
                                    b={b}
                                    specs={canonicalSpecs}
                                />
                            </Suspense>
                            <Suspense fallback={<PackagephobiaDiffSkeleton />}>
                                <PackagephobiaDiff
                                    a={a}
                                    b={b}
                                    specs={canonicalSpecs}
                                />
                            </Suspense>
                        </>
                    }
                    options={options}
                />
                <Suspense fallback={<NpmDiffSkeleton flex="1" />}>
                    <NpmDiff
                        a={a}
                        b={b}
                        specs={canonicalSpecs}
                        options={options}
                    />
                </Suspense>
            </>
        );
    }
};

export default DiffPage;
