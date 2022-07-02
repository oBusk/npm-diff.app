/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        emotion: true,
    },
    experimental: {
        browsersListForSwc: true,
        legacyBrowsers: false,
    },
};
