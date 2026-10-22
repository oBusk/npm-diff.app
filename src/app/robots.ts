import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "GoogleOther",
                disallow: "/",
            },
            {
                userAgent: "*",
                allow: "/",
                disallow: "/api/",
                crawlDelay: 10,
            },
        ],
    };
}
