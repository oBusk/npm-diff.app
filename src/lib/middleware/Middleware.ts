// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextFetchEvent, NextRequest } from "next/server";

export type Middleware = (
    req: NextRequest,
    res?: NextFetchEvent,
) => Promise<Response | undefined> | Response | undefined;
