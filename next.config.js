/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Does not work with appDir
    // https://beta.nextjs.org/docs/styling/css-in-js
    // compiler: {
    //     emotion: true,
    // },
    serverExternalPackages: ["libnpmdiff", "npm-package-arg", "pacote"],
};

export default nextConfig;
