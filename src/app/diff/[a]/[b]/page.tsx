import { type ViewType } from "react-diff-view";
import { createSimplePackageSpec } from "^/lib/createSimplePackageSpec";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import { parseQuery, type QueryParams } from "^/lib/query";
import { simplePackageSpecToString } from "^/lib/SimplePackageSpec";
import BundlephobiaDiff from "./_page/BundlephobiaDiff";
import DiffIntro from "./_page/DiffIntro";
import NpmDiff from "./_page/NpmDiff";
import PackagephobiaDiff from "./_page/PackagephobiaDiff";
import { type DIFF_TYPE_PARAM_NAME } from "./_page/paramNames";

export interface DiffPageProps {
    params: {
        a: string;
        b: string;
    };
    searchParams: QueryParams & {
        [DIFF_TYPE_PARAM_NAME]: ViewType;
    };
}

export function generateMetadata({ params: { a: _a, b: _b } }: DiffPageProps) {
    const a = createSimplePackageSpec(decodeURIComponent(_a));
    const b = createSimplePackageSpec(decodeURIComponent(_b));

    return {
        title: `Comparing ${simplePackageSpecToString(a)}...${simplePackageSpecToString(b)}`,
        description: `A diff between the npm packages "${simplePackageSpecToString(a)}" and "${simplePackageSpecToString(b)}"`,
    };
}

const DiffPage = async ({
    params: { a: _a, b: _b },
    searchParams,
}: DiffPageProps): Promise<JSX.Element> => {
    const { diffFiles, ...optionsQuery } = searchParams;

    const options = parseQuery({
        // If no diffFiles is passed, use the default.
        // This is done here, since we don't want a fall back in the API
        diffFiles: diffFiles ?? DEFAULT_DIFF_FILES_GLOB,
        ...optionsQuery,
    });

    _a = decodeURIComponent(_a);
    _b = decodeURIComponent(_b);

    const specs = [_a, _b] as [string, string];
    const a = createSimplePackageSpec(_a);
    const b = createSimplePackageSpec(_b);

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
                            specs={specs}
                            key={"bundlephobia-" + specs.join("...")}
                        />
                        <PackagephobiaDiff
                            a={a}
                            b={b}
                            specs={specs}
                            key={"packagephobia-" + specs.join("...")}
                        />
                    </>
                }
                options={options}
            />
            <NpmDiff
                a={a}
                b={b}
                specs={specs}
                options={options}
                key={JSON.stringify([specs, options])}
            />
        </>
    );
};

export default DiffPage;
