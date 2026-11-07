import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, type JSX } from "react";
import { isCatalogPage } from "^/lib/utils/isCatalogPage";
import parseParts from "^/lib/utils/parseParts";
import CatalogPage from "./_page/CatalogPage";
import { generateCatalogMetadata } from "./_page/generateCatalogMetadata";

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

const CatalogRoute = async ({
    params,
}: CatalogRouteProps): Promise<JSX.Element> => (
    <CatalogPage specs={await parseCatalogSpecs(params)} />
);

export default CatalogRoute;
