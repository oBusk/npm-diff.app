import { redirect } from "next/navigation";
import { Suspense } from "react";
import { type ViewType } from "react-diff-view";
import { createSimplePackageSpec } from "^/lib/createSimplePackageSpec";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import destination from "^/lib/destination";
import { parseQuery, type QueryParams } from "^/lib/query";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import decodeParts from "^/lib/utils/decodeParts";
import specsToDiff from "^/lib/utils/specsToDiff";
import splitParts from "^/lib/utils/splitParts";
import BundlephobiaDiff from "./_page/BundlephobiaDiff";
import DiffIntro from "./_page/DiffIntro";
import NpmDiff from "./_page/NpmDiff";
import NpmDiffSkeleton from "./_page/NpmDiff/NpmDiff.skeleton";
import PackagephobiaDiff from "./_page/PackagephobiaDiff";
import { type DIFF_TYPE_PARAM_NAME } from "./_page/paramNames";

export interface DiffPageProps {
    params: { parts: string | string[] };
    searchParams: QueryParams & { [DIFF_TYPE_PARAM_NAME]: ViewType };
}

export function generateMetadata({ params: { parts } }: DiffPageProps) {
    const specs = splitParts(decodeParts(parts));

    const [a, b] = specs.map((spec) => createSimplePackageSpec(spec));

    return {
        title: `Comparing ${simplePackageSpecToString(a)}...${simplePackageSpecToString(b)}`,
        description: `A diff between the npm packages "${simplePackageSpecToString(a)}" and "${simplePackageSpecToString(b)}"`,
    };
}

const DiffPage = async ({
    params: { parts },
    searchParams,
}: DiffPageProps): Promise<JSX.Element> => {
    const { diffFiles, ...optionsQuery } = searchParams;

    const specsOrVersions = splitParts(decodeParts(parts));
    const { redirect: redirectTarget, canonicalSpecs } =
        await destination(specsOrVersions);

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
                    className="self-stretch"
                    a={a}
                    b={b}
                    services={
                        <>
                            <BundlephobiaDiff
                                a={a}
                                b={b}
                                specs={canonicalSpecs}
                                key={
                                    "bundlephobia-" + canonicalSpecs.join("...")
                                }
                            />
                            <PackagephobiaDiff
                                a={a}
                                b={b}
                                specs={canonicalSpecs}
                                key={
                                    "packagephobia-" +
                                    canonicalSpecs.join("...")
                                }
                            />
                        </>
                    }
                    options={options}
                />
                <NpmDiff
                    a={a}
                    b={b}
                    specs={canonicalSpecs}
                    options={options}
                    key={JSON.stringify([canonicalSpecs, options])}
                />
            </>
        );
    }
};

export default DiffPage;
