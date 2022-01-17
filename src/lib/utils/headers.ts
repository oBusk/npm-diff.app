import { ServerResponse } from "http";

const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;

const defaultPageCaching = [
    // Let's cache 5 minutes on client side
    `max-age=${5 * minute}`,
    // And the maximum supported vercel 31 days
    `s-maxage=${31 * day}`,
].join(", ");

export function setDefaultPageCaching(res: ServerResponse): void {
    res.setHeader("Cache-Control", defaultPageCaching);
}

export const responseCacheSwr = {
    "Cache-Control": [
        // Cache up to 5 minutes client side
        `max-age=${5 * minute}`,
        `stale-while-revalidate`,
    ].join(", "),
} as const;

export const requestCache30min = {
    "Cache-Control": `max-age=${30 * minute}`,
} as const;

export function setSwrCaching(res: ServerResponse): void {
    res.setHeader(
        "cache-control",
        [
            "public",
            // Don't cache clientside
            `max-age=0`,
            `stale-while-revalidate`,
        ].join(", "),
    );
}

export const headersCache30min = {
    "cache-control": `max-age=${30 * minute}`,
} as const;
