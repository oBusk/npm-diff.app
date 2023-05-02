import type { Metadata } from "next";
import { ReactNode } from "react";
import { ThemeProvider } from "^/components/ThemeProvider";
import Stack from "^/components/ui/Stack";
import { TooltipProvider } from "^/components/ui/Tooltip";
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

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={cn("min-h-screen-s bg-background")}>
                <ThemeProvider>
                    <TooltipProvider>
                        <Stack
                            justify="between"
                            className={cn(
                                "min-h-screen-s",
                                "relative overflow-auto",
                                "px-4",
                            )}
                        >
                            <Header className={cn("bg-background")} />
                            {children}
                            <Footer className={cn("bg-background")} />
                        </Stack>
                    </TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
