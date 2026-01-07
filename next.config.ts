import { type NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    reactCompiler: true,
    serverExternalPackages: ["libnpmdiff", "npm-package-arg", "pacote"],
};

export default nextConfig;
