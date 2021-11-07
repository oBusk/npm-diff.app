import { Middleware, VERSIONS_PATH, versionsEndpoint } from "^/lib/middleware";

const middleware: Middleware = (request) => {
    switch (request?.nextUrl?.pathname) {
        case VERSIONS_PATH:
            return versionsEndpoint(request);
    }
};

export default middleware;
