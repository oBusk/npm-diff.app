/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    // Does not work with appDir
    // https://beta.nextjs.org/docs/styling/css-in-js
    // compiler: {
    //     emotion: true,
    // },
    experimental: { appDir: true },
};
