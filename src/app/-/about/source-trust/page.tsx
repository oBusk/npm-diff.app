import { AlertTriangle, BadgeCheck, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import SourceCard from "^/app/[...parts]/_page/Sources/SourceCard";
import ExternalLink from "^/components/ExternalLink";
import BorderBox from "^/components/ui/BorderBox";
import Heading from "^/components/ui/Heading";
import Stack from "^/components/ui/Stack";
import { getSourceInformation } from "^/lib/api/npm/sourceInformation";

export const metadata: Metadata = {
    title: "Source & Trust – Auditing npm package provenance and trusted publishing",
    description:
        "Learn about the Source & Trust feature for auditing npm packages for supply chain risks using provenance attestation and trusted publishing. Understand how the app verifies source repositories, build workflows, and helps you detect trust regressions before upgrading dependencies.",

    alternates: {
        canonical: "https://npm-diff.app/-/about/source-trust",
    },

    robots: {
        index: true,
        follow: true,
    },

    keywords: [
        "npm provenance",
        "npm trusted publishing",
        "supply chain security",
        "npm security audit",
        "package provenance",
        "dependency security",
        "npm-diff",
    ],

    openGraph: {
        title: "Source & Trust – npm-diff.app feature overview",
        description:
            "Overview of the Source & Trust feature. Understand and audit npm package trust signals, including provenance attestations and trusted publishing, and detect dangerous trust regressions before upgrading dependencies.",
        url: "https://npm-diff.app/-/about/source-trust",
        siteName: "npm-diff.app",
        type: "article",
    },

    twitter: {
        card: "summary_large_image",
        title: "Source & Trust – npm-diff.app feature overview",
        description:
            "Learn how the Source & Trust feature helps you audit npm packages for supply chain risks using provenance and trusted publishing, and catch trust regressions before they bite you.",
    },
};

export default async function SourceTrustPage() {
    "use cache";

    cacheLife("max");

    // Fetch source information for ini@6.0.0 as an example
    const iniSourceInfo = await getSourceInformation({
        name: "ini",
        version: "6.0.0",
    });

    return (
        <Stack gap={8} align="start" className="mx-auto max-w-3xl p-5">
            <div className="w-full text-center">
                <Heading className="mb-4">Source & Trust</Heading>
                <p className="text-lg text-muted-foreground">
                    Audit npm package trust signals in an era of increasing
                    supply chain attacks
                </p>
            </div>

            <div className="w-full space-y-4">
                <p>
                    <strong>npm-diff.app</strong> was created as a tool to audit
                    updates of packages to ensure safe and stable upgrades.
                    Making updates in a safe and defensive way has become
                    increasingly important over the years, with package
                    hijacking and takeovers becoming increasingly prevalent.
                </p>
                <p>
                    The new <strong>Source & Trust feature</strong> enables
                    deeper auditing by linking releases to their original
                    sources and evaluating their trust signals using the npm
                    registry&rsquo;s Provenance and Trusted Publishing features.
                </p>
                <p>
                    <strong>
                        Source & Trust does not determine whether a package is
                        safe.
                    </strong>{" "}
                    It helps you make better-informed trust decisions.
                </p>
            </div>

            <div className="w-full space-y-6">
                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <BadgeCheck className="size-6 text-green-500" />
                        <Heading h={2} className="m-0">
                            Provenance Attestation
                        </Heading>
                    </div>
                    <Stack gap={3} align="start">
                        <p>
                            Provenance is a cryptographically signed attestation
                            that links a package to its source code repository
                            and build environment. When a package is published
                            with provenance, npm records verifiable metadata
                            about:
                        </p>
                        <ul className="list-inside list-disc space-y-1 pl-4">
                            <li>Which repository the code came from</li>
                            <li>
                                The exact commit hash that was built and
                                published
                            </li>
                            <li>
                                The CI/CD platform used (GitHub Actions, GitLab
                                CI/CD)
                            </li>
                            <li>
                                The specific workflow file that performed the
                                build
                            </li>
                        </ul>
                        <p>
                            In practice, this lets you independently verify that
                            a given package artifact corresponds to a specific
                            source revision and build process.
                        </p>
                        <BorderBox variant="warning" className="w-full">
                            <p className="text-sm">
                                <strong>Important:</strong> Provenance only
                                guarantees <em>traceability</em> — you can
                                verify where a package was built and published
                                from. It does <strong>not</strong> guarantee
                                that:
                            </p>
                            <ul className="mt-2 list-inside list-disc space-y-1 pl-4 text-sm">
                                <li>
                                    the repository itself is the
                                    &ldquo;correct&rdquo; repository for that
                                    package
                                </li>
                                <li>
                                    the release does not contain other code
                                    injected at build time
                                </li>
                                <li>the source code itself is safe</li>
                            </ul>
                        </BorderBox>

                        <div className="text-sm">
                            <p className="font-semibold">Read more:</p>
                            <ul className="mt-1 list-inside list-disc space-y-1">
                                <li>
                                    <ExternalLink
                                        href="https://github.blog/security/supply-chain-security/introducing-npm-package-provenance/"
                                        className="underline"
                                    >
                                        GitHub Blog - Introducing npm package
                                        provenance
                                    </ExternalLink>
                                </li>
                                <li>
                                    <ExternalLink
                                        href="https://docs.npmjs.com/generating-provenance-statements"
                                        className="underline"
                                    >
                                        npm documentation - Generating
                                        provenance statements
                                    </ExternalLink>
                                </li>
                            </ul>
                        </div>
                    </Stack>
                </div>

                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <ShieldCheck className="size-6 text-blue-500" />
                        <Heading h={2} className="m-0">
                            Trusted Publishing
                        </Heading>
                    </div>
                    <Stack gap={3} align="start">
                        <p>
                            Trusted Publishing is npm&rsquo;s recommended
                            authentication method that eliminates the need for
                            long-lived access tokens in CI/CD environments.
                        </p>
                        <p>
                            This reduces the use of stealable tokens, which are
                            the primary attack vector in many package takeovers.
                            This also helps ensure that a release is not
                            published from a repository other than the one the
                            maintainer has configured.
                        </p>

                        <BorderBox variant="warning" className="w-full">
                            <p className="text-sm">
                                <strong>Important:</strong> Trusted publishing
                                only guarantees that one particular release was
                                published from the specified repository. It does
                                <strong>not</strong> guarantee that any future
                                releases will be published securely.
                            </p>
                        </BorderBox>

                        <div className="text-sm">
                            <p className="font-semibold">Read more:</p>
                            <ul className="mt-1 list-inside list-disc space-y-1">
                                <li>
                                    <ExternalLink
                                        href="https://docs.npmjs.com/trusted-publishers"
                                        className="underline"
                                    >
                                        npm documentation - Trusted Publishers
                                    </ExternalLink>
                                </li>
                            </ul>
                        </div>
                    </Stack>
                </div>

                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <Heading h={2} className="m-0">
                            📦🔃 npm-diff.app source & trust
                        </Heading>
                    </div>

                    <Stack gap={3} align="start">
                        <p>
                            When comparing releases that were published with
                            provenance, npm-diff.app displays detailed
                            information about the source and build environment
                            for that release. This allows you to look up the
                            exact commit, repository, and build workflow that
                            was used to produce the package.
                        </p>
                        <p>
                            If a release was published using Trusted Publishing,
                            npm-diff.app highlights this with a distinct
                            &ldquo;Trusted Publisher&rdquo; badge in the source
                            information panel.
                        </p>

                        {iniSourceInfo ? (
                            <>
                                <Heading h={5}>Example: ini@6.0.0</Heading>
                                <SourceCard
                                    sourceInformation={iniSourceInfo}
                                    className="w-full max-w-sm"
                                />
                            </>
                        ) : null}
                    </Stack>
                </div>

                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <AlertTriangle className="size-6 text-yellow-500" />
                        <Heading h={2} className="m-0">
                            Trust Audit Warnings
                        </Heading>
                    </div>
                    <Stack gap={3} align="start">
                        <p>
                            In addition to presenting this information for
                            manual auditing, npm-diff.app also highlights
                            potential trust issues when comparing two releases.
                            These warnings are designed to draw attention to
                            changes that may warrant further investigation:
                        </p>
                        <div className="w-full space-y-4">
                            <BorderBox variant="danger" className="w-full">
                                <Stack gap={2} align="start">
                                    <Heading h={4} className="m-0 text-red-600">
                                        Lost Verifiable Provenance
                                    </Heading>
                                    <p className="text-sm">
                                        The older version had verifiable
                                        provenance, but the newer version does
                                        not. This means you can no longer verify
                                        where the package was built or trace it
                                        back to source code.
                                    </p>
                                </Stack>
                            </BorderBox>

                            <BorderBox variant="danger" className="w-full">
                                <Stack gap={2} align="start">
                                    <Heading h={4} className="m-0 text-red-600">
                                        Lost Trusted Publisher
                                    </Heading>
                                    <p className="text-sm">
                                        The older version was published using
                                        Trusted Publishing, but the newer
                                        version was published with a legacy npm
                                        token. This increases the risk of token
                                        compromise.
                                    </p>
                                </Stack>
                            </BorderBox>

                            <BorderBox variant="danger" className="w-full">
                                <Stack gap={2} align="start">
                                    <Heading h={4} className="m-0 text-red-600">
                                        Repository Change
                                    </Heading>
                                    <p className="text-sm">
                                        Both versions have provenance, but they
                                        point to different repositories. This
                                        could indicate a package takeover or
                                        legitimate repository migration.
                                    </p>
                                </Stack>
                            </BorderBox>

                            <BorderBox variant="warning" className="w-full">
                                <Stack gap={2} align="start">
                                    <Heading
                                        h={4}
                                        className="m-0 text-yellow-700"
                                    >
                                        Workflow Change
                                    </Heading>
                                    <p className="text-sm">
                                        The build workflow file name has changed
                                        between versions. While this may be a
                                        legitimate refactor, it&rsquo;s worth
                                        reviewing to ensure the new workflow
                                        maintains security best practices.
                                    </p>
                                </Stack>
                            </BorderBox>
                        </div>
                    </Stack>
                </div>
            </div>
        </Stack>
    );
}
