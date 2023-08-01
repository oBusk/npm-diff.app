"use client";

import {
    Code,
    Heading,
    Link,
    Text,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import NextImage from "next/image";
import {
    externalServicesDarkmode,
    externalServicesLightmode,
} from "./_page/assets";

const AboutPageClient = () => {
    const externalServicesImage = useColorModeValue(
        externalServicesLightmode,
        externalServicesDarkmode,
    );

    return (
        <VStack p={5} shadow="md" borderWidth="1px" spacing={8}>
            <Heading as="h2" size="lg">
                About npm-diff.app
            </Heading>
            <Text>Inspect changes between npm packages in a webapp</Text>
            <Text>
                The comparing matches the behaviour of the CLI by using the
                official{" "}
                <Link
                    href="https://npmjs.com/libnpmdiff"
                    rel="noreferrer noopener"
                    target="_blank"
                >
                    <Code>libnpmdiff</Code>
                </Link>{" "}
                package to perform a diff between the packages you chose. We
                then visualize the differance.
            </Text>
            <Heading as="h3" size="md">
                Redirection
            </Heading>
            <Text>
                For the URL you can use formats that are not exact, like:{" "}
                <Link
                    href="https://npm-diff.app/lodash@4.17.0...~4.17.15"
                    rel="noreferrer noopener"
                    target="_blank"
                >
                    <Code>https://npm-diff.app/lodash@4.17.0...~4.17.15</Code>
                </Link>{" "}
                or{" "}
                <Link
                    href="https://npm-diff.app/react@18.0.0...react@latest"
                    rel="noreferrer noopener"
                    target="_blank"
                >
                    <Code>
                        https://npm-diff.app/react@18.0.0...react@latest
                    </Code>
                </Link>
                . If you go to any URL which is not exact, and therefore can
                change over time, we will redirect you to the exact URL. You
                will be redirected to an exact, canonical URL. This means you
                will get a cached version even if you used a unique query.
            </Text>
            <Heading as="h3" size="md">
                External services
            </Heading>
            <NextImage
                src={externalServicesImage}
                alt="Screenshot of external services in npm-diff.app"
                priority
                style={{ width: "auto", height: "auto" }}
            />
            <Text>
                We also use external services{" "}
                <Link href="https://bundlephobia.com">bundlephobia</Link> and{" "}
                <Link href="https://packagephobia.com">packagephobia</Link> to
                give an overview of the differances between the two, measured in
                install and bundle size.
            </Text>
        </VStack>
    );
};

export default AboutPageClient;
