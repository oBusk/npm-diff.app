import { type NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    reactCompiler: true,
    serverExternalPackages: [
        "libnpmdiff",
        "@internal/npm-spec",
        "npm-package-arg",
        "pacote",
        "node-gyp",
    ],
    cacheComponents: true,
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
};

export default nextConfig;
