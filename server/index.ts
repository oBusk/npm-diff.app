import { createServer } from "http";
import { parse } from "url";
import next from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url!, true);
        const { pathname, query } = parsedUrl;

        const [a, b] = pathname!.slice(1).split("...");

        if (a && a.length > 0 && b && b.length > 0) {
            app.render(req, res, "/diff", {
                ...query,
                a,
                b,
            });
        } else {
            handle(req, res, parsedUrl);
        }
    }).listen(port);

    // tslint:disable-next-line:no-console
    console.log(
        `> Server listening at http://localhost:${port} as ${
            dev ? "development" : process.env.NODE_ENV
        }`,
    );
});
