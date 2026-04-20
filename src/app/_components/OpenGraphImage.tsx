import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export interface OpenGraphImageProps {
    /**
     * Tag to display (e.g., "Feature", "About", "API")
     */
    tag: string;
    /**
     * Main title text
     */
    title: string;
    /**
     * Icon to display on the right side (SVG element)
     */
    icon: ReactNode;
    /**
     * Background color (default: "#0d1117")
     */
    backgroundColor?: string;
}

/**
 * Reusable OpenGraph image component for npm-diff.app
 * Creates a consistent OG image with a tag, title, and icon
 */
export async function OpenGraphImage({
    tag,
    title,
    icon,
    backgroundColor = "#0d1117",
}: OpenGraphImageProps) {
    const logoData = await readFile(join(process.cwd(), "src/app/icon.png"));
    const logoSrc = Uint8Array.from(logoData).buffer;

    return new ImageResponse(
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor,
                backgroundImage:
                    "radial-gradient(circle at bottom left, rgba(18, 39, 74, 1), transparent 70%), radial-gradient(circle at top right, rgba(18, 39, 74, 1), transparent 70%), linear-gradient(rgba(55, 65, 81, 0.3) 2px, transparent 2px), linear-gradient(90deg, rgba(55, 65, 81, 0.3) 2px, transparent 2px)",
                backgroundSize: "100% 100%, 100% 100%, 50px 50px, 50px 50px",
                position: "relative",
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element -- OpenGraph images require standard img tag */}
            <img
                src={logoSrc as unknown as string}
                width={80}
                height={80}
                style={{
                    position: "absolute",
                    top: 40,
                    left: 40,
                }}
                alt="npm-diff.app icon"
            />
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    width: "100%",
                    padding: "0 80px",
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        border: "2px solid rgba(59, 130, 246, 0.5)",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        color: "rgba(147, 197, 253, 1)",
                        fontSize: "24px",
                        fontWeight: 600,
                    }}
                >
                    {tag}
                </div>
                <h1
                    style={{
                        fontSize: "72px",
                        fontWeight: 700,
                        color: "white",
                        margin: 0,
                        lineHeight: 1.1,
                    }}
                >
                    {title}
                </h1>
            </div>
            {icon}
            <div
                style={{
                    position: "absolute",
                    bottom: 40,
                    left: 80,
                    fontSize: "32px",
                    fontWeight: 600,
                    color: "rgba(156, 163, 175, 1)",
                }}
            >
                npm-diff.app
            </div>
        </div>,
        {
            ...size,
        },
    );
}
