import type { Metadata } from "next";
import AboutPageClient from "./page.client";

export const metadata = {
    title: "About",
} satisfies Metadata;

// Ensure static rendering https://beta.nextjs.org/docs/api-reference/segment-config#dynamic
export const dynamic = "force-static";
// TODO export const runtime = "experimental-edge";
const AboutPage = () => <AboutPageClient />;

export default AboutPage;
