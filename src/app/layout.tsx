import type { Metadata } from "next";
import LayoutClient from "./layout.client";

export const metadata = {
    applicationName: "npm-diff.app",
    title: {
        default: "npm-diff.app 📦🔃",
        template: "%s  • npm-diff.app 📦🔃",
    },
    description: "Inspect changes between npm packages in a webapp",
    manifest: "/site.webmanifest",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    themeColor: "#3f444e",
} satisfies Metadata;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <LayoutClient>{children}</LayoutClient>
            </body>
        </html>
    );
}
