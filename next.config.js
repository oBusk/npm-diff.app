/** @type {import('next').NextConfig} */
module.exports = {
    swcMinify: true,
    experimental: {
        browsersListForSwc: true,
        legacyBrowsers: false,
    },
};
