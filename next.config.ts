import { type NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    reactCompiler: true,
    serverExternalPackages: ["libnpmdiff", "npm-package-arg", "pacote"],
    // Enable Cache Components (moved to root level in 16.1.1)
    cacheComponents: true,
};

export default nextConfig;
