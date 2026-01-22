import type { Metadata } from "next";
import ExternalLink from "^/components/ExternalLink";
import Heading from "^/components/ui/Heading";
import Stack from "^/components/ui/Stack";

export const metadata: Metadata = {
    title: "Source & Trust",
    description: "Understanding package provenance and trust signals",
};

export default function SourceTrustPage() {
    return (
        <Stack gap={8} align="center" className="border p-5">
            <Heading>Source & Trust</Heading>
            <p>
                When comparing npm packages, understanding the trustworthiness
                and provenance of each version is critical for supply chain
                security.
            </p>

            <Heading h={2}>What is Provenance?</Heading>
            <p>
                <ExternalLink
                    href="https://docs.npmjs.com/generating-provenance-statements"
                    rel="noreferrer noopener"
                    target="_blank"
                >
                    Provenance
                </ExternalLink>{" "}
                is a signed attestation that links a package to its source code
                repository and build process. It provides verifiable evidence
                about where and how a package was built.
            </p>

            <Heading h={2}>Trusted Publishing</Heading>
            <p>
                <ExternalLink
                    href="https://docs.npmjs.com/trusted-publishers"
                    rel="noreferrer noopener"
                    target="_blank"
                >
                    Trusted Publishing
                </ExternalLink>{" "}
                eliminates the need for long-lived authentication tokens by
                allowing automated publishing directly from GitHub Actions or
                GitLab CI/CD pipelines using short-lived credentials.
            </p>

            <Heading h={2}>Trust Audit Findings</Heading>
            <p>
                npm-diff.app automatically audits package versions for trust
                signals and flags potential security concerns, including:
            </p>
            <ul className="list-inside list-disc space-y-2 text-left">
                <li>
                    <strong>Missing Verifiable Provenance</strong> - Package
                    published without provenance attestation
                </li>
                <li>
                    <strong>Trusted Publishing Bypassed</strong> - Published
                    using legacy token authentication instead of trusted
                    publishing
                </li>
                <li>
                    <strong>Source Repository Mismatch</strong> - Provenance
                    points to a different repository than expected
                </li>
                <li>
                    <strong>Build Workflow Modified</strong> - The build process
                    or workflow file has changed between versions
                </li>
            </ul>

            <Heading h={2}>Interpreting Findings</Heading>
            <p>
                Trust audit findings are displayed when comparing packages. Red
                findings indicate high-risk signals that may warrant immediate
                investigation, while yellow findings suggest changes that should
                be reviewed but may be legitimate refactoring.
            </p>
        </Stack>
    );
}
