/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Source & Trust – npm-diff.app";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
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
                backgroundColor: "#0d1117",
                backgroundImage:
                    "radial-gradient(circle at bottom left, rgba(18, 39, 74, 1), transparent 70%), radial-gradient(circle at top right, rgba(18, 39, 74, 1), transparent 70%), linear-gradient(rgba(55, 65, 81, 0.3) 2px, transparent 2px), linear-gradient(90deg, rgba(55, 65, 81, 0.3) 2px, transparent 2px)",
                backgroundSize: "100% 100%, 100% 100%, 50px 50px, 50px 50px",
                position: "relative",
            }}
        >
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
                    Feature
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
                    Source & Trust
                </h1>
            </div>
            <svg
                width="300"
                height="300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(59, 130, 246, 0.8)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    position: "absolute",
                    right: 80,
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
            >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
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
