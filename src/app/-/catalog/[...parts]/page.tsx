import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, type JSX, Suspense } from "react";
import {
    CatalogPageContent,
    CatalogPageFallback,
} from "^/app/[...parts]/_page/catalog/CatalogPage";
import { generateCatalogMetadata } from "^/app/[...parts]/_page/catalog/generateCatalogMetadata";
import { isCatalogPage } from "^/lib/utils/isCatalogPage";
import parseParts from "^/lib/utils/parseParts";

export const ensureStatic = "shell";

export const maxDuration = 15;

type CatalogRouteProps = Pick<PageProps<"/-/catalog/[...parts]">, "params">;

const parseCatalogPath = cache((path: string) => {
    const specs = parseParts(path, { decode: true });

    if (specs == null || !isCatalogPage(specs)) {
        notFound();
    }

    return specs;
});

async function parseCatalogSpecs(params: CatalogRouteProps["params"]) {
    const { parts } = await params;
    return parseCatalogPath(parts.join("/"));
}

export async function generateMetadata({
    params,
}: CatalogRouteProps): Promise<Metadata> {
    return generateCatalogMetadata(await parseCatalogSpecs(params));
}

const CatalogRouteInner = async ({
    params,
}: CatalogRouteProps): Promise<JSX.Element> => (
    <CatalogPageContent specs={await parseCatalogSpecs(params)} />
);

const CatalogRoute = (props: CatalogRouteProps) => (
    <Suspense fallback={<CatalogPageFallback />}>
        <CatalogRouteInner {...props} />
    </Suspense>
);

export default CatalogRoute;
