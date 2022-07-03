/** @type {import('next').NextConfig} */
module.exports = {
    swcMinify: true,
    compiler: {
        emotion: true,
    },
    experimental: {
        browsersListForSwc: true,
        legacyBrowsers: false,
    },
};
