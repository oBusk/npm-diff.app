import { NextFetchEvent, NextRequest } from "next/server";

export type Middleware = (
    req: NextRequest,
    res?: NextFetchEvent,
) => Promise<Response | undefined> | Response | undefined;
