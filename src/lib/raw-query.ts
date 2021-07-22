import { IncomingMessage } from "http";

export function rawQuery(req: IncomingMessage): string {
    return req.url?.match(/\?.*/)?.[0] ?? "";
}

export default rawQuery;
