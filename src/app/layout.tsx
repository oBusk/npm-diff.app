import { type Metadata, type Viewport } from "next";
import { type ReactNode } from "react";
import LayoutClient from "./layout.client";

export const metadata = {
    applicationName: "npm-diff.app",
    title: {
        default: "npm-diff.app 📦🔃",
        template: "%s • npm-diff.app 📦🔃",
    },
    description: "Inspect changes between npm packages in a webapp",
    manifest: "/site.webmanifest",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
} satisfies Metadata;

export const viewport = {
    themeColor: "#3f444e",
} satisfies Viewport;

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body suppressHydrationWarning>
                <LayoutClient>{children}</LayoutClient>
            </body>
        </html>
    );
}
