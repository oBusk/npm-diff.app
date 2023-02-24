import AboutPageClient from "./page.client";

// Ensure static rendering https://beta.nextjs.org/docs/api-reference/segment-config#dynamic
export const dynamic = "force-static";
// TODO export const runtime = "experimental-edge";
const AboutPage = () => <AboutPageClient />;

export default AboutPage;
