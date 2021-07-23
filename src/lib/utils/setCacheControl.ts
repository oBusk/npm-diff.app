import { ServerResponse } from "http";

const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;

const cacheControl = `public, max-age=${day * 31}`;

function setCacheControl(res: ServerResponse): void {
    res.setHeader("Cache-Control", cacheControl);
}

export default setCacheControl;
