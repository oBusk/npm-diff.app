import type { Metadata } from "next";
import ExternalLink from "^/components/ExternalLink";
import Code from "^/components/ui/Code";
import Heading from "^/components/ui/Heading";
import Image from "^/components/ui/Image";
import Stack from "^/components/ui/Stack";
import {
    externalServicesDarkmode,
    externalServicesLightmode,
} from "./_page/assets";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn how npm-diff.app works. Compare npm packages using the official libnpmdiff library, visualize differences, and analyze bundle sizes with bundlephobia and packagephobia integrations.",
    openGraph: {
        title: "About npm-diff.app",
        description:
            "Learn how npm-diff.app compares npm packages using the official libnpmdiff library and visualizes the differences for safer dependency upgrades.",
        url: "https://npm-diff.app/-/about",
    },
    twitter: {
        card: "summary_large_image",
        title: "About npm-diff.app",
        description:
            "Learn how npm-diff.app compares npm packages using the official libnpmdiff library and visualizes the differences for safer dependency upgrades.",
    },
};

export default function AboutPage() {
    return (
        <Stack gap={8} align="center" className="border p-5">
            <Heading>About npm-diff.app</Heading>
            <p>Inspect changes between npm packages in a webapp</p>
            <p>
                The comparing matches the behaviour of the CLI by using the
                official{" "}
                <ExternalLink
                    href="https://npmjs.com/libnpmdiff"
                    rel="noreferrer noopener"
                    target="_blank"
                >
                    <Code>libnpmdiff</Code>
                </ExternalLink>{" "}
                package to perform a diff between the packages you chose. We
                then visualize the difference.
            </p>
            <Heading>Redirection</Heading>
            <p>
                For the URL you can use formats that are not exact, like:{" "}
                <ExternalLink href="https://npm-diff.app/lodash@4.17.0...~4.17.15">
                    <Code>https://npm-diff.app/lodash@4.17.0...~4.17.15</Code>
                </ExternalLink>{" "}
                or{" "}
                <ExternalLink href="https://npm-diff.app/react@18.0.0...react@latest">
                    <Code>
                        https://npm-diff.app/react@18.0.0...react@latest
                    </Code>
                </ExternalLink>
                . If you go to any URL which is not exact, and therefore can
                change over time, we will redirect you to the exact URL. You
                will be redirected to an exact, canonical URL. This means you
                will get a cached version even if you used a unique query.
            </p>
            <Heading>External services</Heading>
            <Image
                lightSrc={externalServicesLightmode}
                darkSrc={externalServicesDarkmode}
                alt="Screenshot of external services in npm-diff.app"
            />
            <p>
                We also use external services{" "}
                <ExternalLink href="https://bundlephobia.com">
                    bundlephobia
                </ExternalLink>{" "}
                and{" "}
                <ExternalLink href="https://packagephobia.com">
                    packagephobia
                </ExternalLink>{" "}
                to give an overview of the differences between the two, measured
                in install and bundle size.
            </p>
        </Stack>
    );
}
