import defaultMetaData from "^/lib/metaData/defaultMetaData";
import LayoutClient from "./layout.client";

// Ensure static rendering https://beta.nextjs.org/docs/api-reference/segment-config#dynamic
export const dynamic = "force-static";
export const runtime = "experimental-edge";
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />

                <title>{defaultMetaData.title}</title>
                <meta
                    name="description"
                    content={defaultMetaData.description}
                />
            </head>
            <body>
                <LayoutClient>{children}</LayoutClient>
            </body>
        </html>
    );
}
