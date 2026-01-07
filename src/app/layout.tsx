import { type Metadata, type Viewport } from "next";
import { type ReactNode, Suspense } from "react";
import { ThemeProvider } from "^/components/ThemeProvider";
import Stack from "^/components/ui/Stack";
import { TooltipProvider } from "^/components/ui/Tooltip";
import Footer from "./_layout/Footer";
import Header from "./_layout/Header";
import "./globals.css";

export const metadata: Metadata = {
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
};

export const viewport = {
    themeColor: "#3f444e",
} satisfies Viewport;

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className="min-h-screen-s bg-background">
                {/* Cache Components: Wrap in Suspense to prevent blocking route errors */}
                <Suspense fallback={<div className="min-h-screen-s" />}>
                    <ThemeProvider>
                        <TooltipProvider>
                            <Stack
                                justify="between"
                                className="min-h-screen-s relative overflow-auto px-4"
                            >
                                {/* Cache Components: Wrap Header in Suspense since it uses usePathname() for navigation state */}
                                <Suspense fallback={<div className="h-24" />}>
                                    <Header className="bg-background" />
                                </Suspense>
                                {children}
                                <Footer className="bg-background" />
                            </Stack>
                        </TooltipProvider>
                    </ThemeProvider>
                </Suspense>
            </body>
        </html>
    );
}
