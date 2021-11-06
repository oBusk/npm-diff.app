import { Middleware, versionsEndpoint } from "^/lib/middleware";

const middleware: Middleware = (request) => {
    switch (request?.nextUrl?.pathname) {
        case "/versions":
            return versionsEndpoint(request);
    }
};

export default middleware;
