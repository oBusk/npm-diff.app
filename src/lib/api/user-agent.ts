/**
 * Be nice to APIs and inform them who we are, with traceability when deployed on Vercel.
 */
export const userAgent = () => {
    const { VERCEL_ENV, VERCEL_DEPLOY_ID, VERCEL_GIT_COMMIT_SHA } = process.env;

    const parts = [`env=${VERCEL_ENV ?? "development"}`];

    if (VERCEL_DEPLOY_ID) {
        parts.push(`deploy=${VERCEL_DEPLOY_ID}`);
    }
    if (VERCEL_GIT_COMMIT_SHA) {
        parts.push(`commit=${VERCEL_GIT_COMMIT_SHA}`);
    }

    return `npm-diff.app (${parts.join("; ")}; +https://github.com/oBusk/npm-diff.app)`;
};
