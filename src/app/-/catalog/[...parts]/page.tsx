import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { type JSX, Suspense } from "react";
import CatalogPage, {
    CatalogPageFallback,
} from "^/app/[...parts]/_page/catalog/CatalogPage";
import { generateCatalogMetadata } from "^/app/[...parts]/_page/catalog/generateCatalogMetadata";
import { isCatalogPage } from "^/lib/utils/isCatalogPage";
import parseParts from "^/lib/utils/parseParts";

export interface CatalogRouteProps {
    params: Promise<{ parts: string | string[] }>;
}

async function parseCatalogSpecs(params: CatalogRouteProps["params"]) {
    const { parts } = await params;
    const specs = parseParts(parts, { decode: true });

    if (specs == null || !isCatalogPage(specs)) {
        notFound();
    }

    return specs;
}

export async function generateMetadata({
    params,
}: CatalogRouteProps): Promise<Metadata> {
    return generateCatalogMetadata(await parseCatalogSpecs(params));
}

const CatalogRouteInner = async ({
    params,
}: CatalogRouteProps): Promise<JSX.Element> => (
    <CatalogPage specs={await parseCatalogSpecs(params)} />
);

const CatalogRoute = (props: CatalogRouteProps) => (
    <Suspense fallback={<CatalogPageFallback />}>
        <CatalogRouteInner {...props} />
    </Suspense>
);

export default CatalogRoute;
