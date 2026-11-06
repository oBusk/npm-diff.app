export const CATALOG_ROUTE_PREFIX = "/-/catalog";

const CATALOG_NAME = String.raw`[^@/.%](?!.*\.\.\.)[^@/%]*`;

export const catalogRewrites = [
    {
        source: `/:name(${CATALOG_NAME})`,
        destination: `${CATALOG_ROUTE_PREFIX}/:name`,
    },
    {
        source: `/:scope((?:@|%40)${CATALOG_NAME})/:name([^@/.%][^@/%]*)`,
        destination: `${CATALOG_ROUTE_PREFIX}/:scope/:name`,
    },
];

export const catalogRedirects = [
    {
        source: `${CATALOG_ROUTE_PREFIX}/:parts*`,
        destination: "/:parts*",
        permanent: false,
    },
];
