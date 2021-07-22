import { ServerResponse } from "http";

const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;

export const cacheControl = `public, max-age=${day * 31}`;

export function setCacheControl(res: ServerResponse): void {
    res.setHeader("Cache-Control", cacheControl);
}

export default setCacheControl;
