import { type Metadata, type Viewport } from "next";
import { type ReactNode } from "react";
import { ThemeProvider } from "^/components/ThemeProvider";
import Stack from "^/components/ui/Stack";
import { TooltipProvider } from "^/components/ui/Tooltip";
import Footer from "./_layout/Footer";
import Header from "./_layout/Header";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://npm-diff.app"),
    applicationName: "npm-diff.app",
    title: {
        default: "npm-diff.app 📦🔃",
        template: "%s • npm-diff.app 📦🔃",
    },
    description:
        "Inspect and compare changes between npm package versions in a webapp. View diffs, analyze bundle size changes, and audit trust signals like provenance and trusted publishing for safer dependency upgrades.",
    manifest: "/site.webmanifest",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    keywords: [
        "npm",
        "diff",
        "package comparison",
        "dependency audit",
        "npm packages",
        "version diff",
        "bundle size",
        "npm security",
        "provenance",
        "trusted publishing",
    ],
    authors: [{ name: "Oscar Busk", url: "https://github.com/oBusk" }],
    creator: "Oscar Busk",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://npm-diff.app",
        siteName: "npm-diff.app",
        title: "npm-diff.app 📦🔃",
        description:
            "Inspect and compare changes between npm package versions. View diffs, analyze bundle sizes, and audit trust signals for safer dependency upgrades.",
    },
    twitter: {
        card: "summary_large_image",
        title: "npm-diff.app 📦🔃",
        description:
            "Inspect and compare changes between npm package versions. View diffs, analyze bundle sizes, and audit trust signals for safer dependency upgrades.",
        creator: "@oBusk",
    },
};

export const viewport = {
    themeColor: "#3f444e",
} satisfies Viewport;

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className="min-h-screen-s bg-background">
                <ThemeProvider>
                    <TooltipProvider>
                        <Stack
                            justify="between"
                            className="min-h-screen-s relative overflow-auto px-4"
                        >
                            <Header className="bg-background" />
                            {children}
                            <Footer className="bg-background" />
                        </Stack>
                    </TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
