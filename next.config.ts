import { type NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    reactCompiler: true,
    serverExternalPackages: ["libnpmdiff", "npm-package-arg", "pacote"],
    cacheComponents: true,
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
};

export default nextConfig;
