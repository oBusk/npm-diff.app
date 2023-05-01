import type { Metadata } from "next";
import { ReactNode } from "react";
import { ThemeProvider } from "^/components/ThemeProvider";
import cn from "^/lib/cn";
import Footer from "./_layout/Footer";
import Header from "./_layout/Header";
import "./globals.css";

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

const sitebackground = cn("bg-background");

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={cn(sitebackground, "min-h-screen-s")}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <div
                        className={cn(
                            "min-h-screen-s",
                            "relative overflow-auto",
                            "flex flex-col justify-between",
                            "px-4",
                        )}
                    >
                        <Header className={cn(sitebackground)} />
                        {children}
                        <Footer className={cn(sitebackground)} />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
