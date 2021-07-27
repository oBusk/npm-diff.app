import { ServerResponse } from "http";

const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;

const cacheControl = [
    "public",
    // Let's cache 5 minutes on client side
    `max-age=${5 * minute}`,
    // And the maximum supported vercel 31 days
    `s-maxage=${31 * day}`,
].join(", ");

function setCacheControl(res: ServerResponse): void {
    res.setHeader("Cache-Control", cacheControl);
}

export default setCacheControl;
