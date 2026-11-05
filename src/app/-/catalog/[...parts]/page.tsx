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

type CatalogParts = string | string[];

export interface CatalogRouteProps {
    params: Promise<{ parts: CatalogParts }>;
}

const parseCatalogParts = cache((partsJson: string) => {
    const specs = parseParts(JSON.parse(partsJson) as CatalogParts, {
        decode: true,
    });

    if (specs == null || !isCatalogPage(specs)) {
        notFound();
    }

    return specs;
});

async function parseCatalogSpecs(params: CatalogRouteProps["params"]) {
    const { parts } = await params;
    return parseCatalogParts(JSON.stringify(parts));
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
