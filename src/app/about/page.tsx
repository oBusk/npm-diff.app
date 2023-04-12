import type { Metadata } from "next";
import AboutPageClient from "./page.client";

export const metadata = {
    title: "About",
} satisfies Metadata;

// TODO export const runtime = "experimental-edge";
const AboutPage = () => <AboutPageClient />;

export default AboutPage;
