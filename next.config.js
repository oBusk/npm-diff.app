/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        browsersListForSwc: true,
        legacyBrowsers: false,
    },
};
