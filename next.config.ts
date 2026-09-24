import { type NextConfig } from "next";

const securityHeaders = [
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
        key: "Permissions-Policy",
        value: [
            "accelerometer=()",
            "bluetooth=()",
            "camera=()",
            "display-capture=()",
            "geolocation=()",
            "gyroscope=()",
            "hid=()",
            "magnetometer=()",
            "microphone=()",
            "midi=()",
            "payment=()",
            "serial=()",
            "usb=()",
        ].join(", "),
    },
];

const nextConfig: NextConfig = {
    reactStrictMode: true,
    reactCompiler: true,
    serverExternalPackages: ["libnpmdiff", "npm-package-arg", "pacote"],
    cacheComponents: true,
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: "/:path*",
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;
