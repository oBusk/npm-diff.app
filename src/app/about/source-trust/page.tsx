import {
    AlertTriangle,
    CheckCircle2,
    ShieldAlert,
    ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import SourceCard from "^/app/[...parts]/_page/Sources/SourceCard";
import ProvenanceCard from "^/app/[...parts]/_page/Sources/SourceCard/ProvenanceCard";
import { TrustedPublisherCard } from "^/app/[...parts]/_page/Sources/SourceCard/TrustedPublisherCard";
import ExternalLink from "^/components/ExternalLink";
import BorderBox from "^/components/ui/BorderBox";
import Heading from "^/components/ui/Heading";
import Stack from "^/components/ui/Stack";
import { getSourceInformation } from "^/lib/api/npm/sourceInformation";

export const metadata: Metadata = {
    title: "Source & Trust",
    description:
        "Audit npm package trust and provenance to protect against supply chain attacks",
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
                    Audit npm package trust signals in a world of increasing
                    supply chain attacks
                </p>
            </div>

            <BorderBox className="w-full">
                <Stack gap={4} align="start">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="size-6 text-red-500" />
                        <Heading h={2} className="m-0">
                            Why This Matters
                        </Heading>
                    </div>
                    <p>
                        Supply chain attacks targeting npm packages are
                        increasingly common. Malicious actors can compromise
                        legitimate packages, inject backdoors, or hijack publish
                        credentials. The Source & Trust feature helps you
                        identify trust signals and spot potential security
                        regressions when comparing package versions.
                    </p>
                </Stack>
            </BorderBox>

            <div className="w-full space-y-6">
                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <CheckCircle2 className="size-6 text-green-500" />
                        <Heading h={2} className="m-0">
                            Provenance Attestation
                        </Heading>
                    </div>
                    <Stack gap={3} align="start">
                        <p>
                            Provenance (via Sigstore) is a cryptographically
                            signed attestation that links a package to its
                            source code repository and build environment. When a
                            package is published with provenance, npm stores
                            verifiable metadata about:
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
                                <li>the repository itself is trustworthy</li>
                                <li>the code is safe</li>
                                <li>
                                    the repository is the &ldquo;correct&rdquo;
                                    one for that package name
                                </li>
                            </ul>
                        </BorderBox>
                        <div>
                            <Heading h={3} className="mb-2 font-semibold">
                                How npm-diff.app displays provenance
                            </Heading>
                            <p>
                                When viewing a diff, npm-diff.app shows source
                                information for both versions side-by-side. For
                                packages with provenance, you&rsquo;ll see:
                            </p>
                            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
                                <li>
                                    Repository URL and commit hash (with links
                                    to GitHub/GitLab)
                                </li>
                                <li>
                                    Build platform badge (GitHub Actions or
                                    GitLab CI/CD)
                                </li>
                                <li>
                                    Workflow file name with link to the exact
                                    version used
                                </li>
                                <li>
                                    Public ledger verification link
                                    (Sigstore/Rekor)
                                </li>
                            </ul>
                        </div>
                        {iniSourceInfo ? (
                            <>
                                <Heading h={3} className="mb-3 font-semibold">
                                    Example: ini@6.0.0
                                </Heading>
                                <div className="max-w-md space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        Here&rsquo;s what the complete source
                                        card looks like for a package with
                                        provenance:
                                    </p>
                                    <SourceCard
                                        sourceInformation={iniSourceInfo}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Provenance card standalone:
                                    </p>
                                    <ProvenanceCard
                                        sourceInformation={iniSourceInfo}
                                    />
                                </div>
                            </>
                        ) : null}
                        <div className="text-sm">
                            <p className="font-semibold">Read more:</p>
                            <ul className="mt-1 space-y-1">
                                <li>
                                    <ExternalLink href="https://github.blog/security/supply-chain-security/introducing-npm-package-provenance/">
                                        Introducing npm package provenance
                                        (GitHub Blog)
                                    </ExternalLink>
                                </li>
                                <li>
                                    <ExternalLink href="https://docs.npmjs.com/generating-provenance-statements">
                                        Generating provenance statements (npm
                                        docs)
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
                            Instead of storing npm tokens as secrets in your CI
                            environment, Trusted Publishing allows GitHub
                            Actions and GitLab CI/CD to publish directly using
                            short-lived, automatically rotating credentials.
                        </p>
                        <p>
                            This significantly reduces the risk of token theft
                            and unauthorized package publication. When a package
                            is published with Trusted Publishing, the npm
                            registry verifies that the publish request came from
                            an authorized CI/CD workflow configured by the
                            package maintainer.
                        </p>
                        <div>
                            <Heading h={3} className="mb-2 font-semibold">
                                How npm-diff.app highlights trusted publishing
                            </Heading>
                            <p>
                                Packages published with Trusted Publishing
                                display a distinct &ldquo;Trusted
                                Publisher&rdquo; badge in the source information
                                panel. This indicates that the package was
                                published using secure, token-less
                                authentication instead of legacy npm tokens.
                            </p>
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold">Read more:</p>
                            <ul className="mt-1 space-y-1">
                                <li>
                                    <ExternalLink href="https://docs.npmjs.com/trusted-publishers">
                                        Trusted Publishers (npm docs)
                                    </ExternalLink>
                                </li>
                            </ul>
                        </div>
                        {iniSourceInfo ? (
                            <>
                                <Heading h={3} className="mb-3 font-semibold">
                                    Example: ini@6.0.0
                                </Heading>
                                <div className="max-w-md">
                                    <p className="mb-3 text-sm text-muted-foreground">
                                        The Trusted Publisher badge appears
                                        below the provenance information:
                                    </p>
                                    <TrustedPublisherCard
                                        sourceInformation={iniSourceInfo}
                                    />
                                </div>
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
                            When comparing two package versions, npm-diff.app
                            automatically audits for trust degradation and
                            security concerns. These warnings are designed to
                            catch security and trust regressions between
                            versions — cases where the newer version is, from a
                            supply-chain perspective, strictly worse than the
                            previous one.
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
