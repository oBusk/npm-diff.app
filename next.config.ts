import { type NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    reactCompiler: true,
    serverExternalPackages: ["libnpmdiff", "npm-package-arg", "pacote"],
    cacheComponents: true,
};

export default nextConfig;
