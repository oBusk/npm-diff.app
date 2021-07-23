import { IncomingMessage } from "http";

/**
 * Returns the query string as it is in the request, but removing any query
 * parameter that matches a given name `remove`.
 */
function rawQuery(req: IncomingMessage, remove: string): string {
    const queryString = req.url?.match(/\?(.*)/)?.[1] ?? "";

    const removeRegex = new RegExp(`${remove}=.+($|&)`, "g");

    const cleaned = queryString.replace(removeRegex, "");

    return cleaned?.length > 0 ? `?${cleaned}` : "";
}

export default rawQuery;
