import type { MetadataRoute } from "next";
import getCrawlableDiffs from "^/lib/crawlableDiffs";

export default async function robots(): Promise<MetadataRoute.Robots> {
    return {
        rules: [
            {
                userAgent: "GoogleOther",
                disallow: "/",
            },
            {
                userAgent: "*",
                allow: ["/", ...(await getCrawlableDiffs())],
                disallow: ["/api/", "/*..."],
                crawlDelay: 10,
            },
        ],
    };
}
