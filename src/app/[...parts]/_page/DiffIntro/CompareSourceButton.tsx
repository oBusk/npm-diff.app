import { GitCompareArrows } from "lucide-react";
import ExternalLink from "^/components/ExternalLink";
import Button from "^/components/ui/Button";
import Skeleton from "^/components/ui/Skeleton";
import getTrustEvidence from "^/lib/api/npm/getTrustEvidence";
import { cx } from "^/lib/cva";
import type SimplePackageSpec from "^/lib/SimplePackageSpec";
import suspense from "^/lib/suspense";

export interface CompareSourceButtonProps {
    className?: string;
    a: SimplePackageSpec;
    b: SimplePackageSpec;
}

const shared = cx("my-2 flex items-center justify-center");

/**
 * Extract GitHub compare URL from two provenance URLs
 */
function getGitHubCompareUrl(aUrl: string, bUrl: string): string | undefined {
    // Match both /commit/ and /tree/ URLs
    const aMatch = aUrl.match(
        /github\.com\/([^/]+\/[^/]+)\/(?:commit|tree)\/([a-f0-9]+)/,
    );
    const bMatch = bUrl.match(
        /github\.com\/([^/]+\/[^/]+)\/(?:commit|tree)\/([a-f0-9]+)/,
    );

    if (aMatch && bMatch && aMatch[1] === bMatch[1]) {
        const repo = aMatch[1];
        const aCommit = aMatch[2];
        const bCommit = bMatch[2];
        return `https://github.com/${repo}/compare/${aCommit}...${bCommit}`;
    }

    return undefined;
}

async function CompareSourceButton({
    a,
    b,
    className,
}: CompareSourceButtonProps) {
    const aResult = await getTrustEvidence(a);
    const bResult = await getTrustEvidence(b);

    const compareUrl =
        aResult.provenanceUrl && bResult.provenanceUrl
            ? getGitHubCompareUrl(aResult.provenanceUrl, bResult.provenanceUrl)
            : undefined;

    if (!compareUrl) {
        return null;
    }

    return (
        <div className={cx(shared, className)}>
            <Button variant="secondary" size="sm" asChild>
                <ExternalLink
                    href={compareUrl}
                    className="inline-flex items-center gap-2"
                >
                    <GitCompareArrows className="size-4" />
                    Compare source
                </ExternalLink>
            </Button>
        </div>
    );
}

function CompareSourceButtonFallback({ className }: CompareSourceButtonProps) {
    return (
        <div className={cx(shared, className)}>
            <Skeleton className="h-8 w-32" />
        </div>
    );
}

const SuspensedCompareSourceButton = suspense(
    CompareSourceButton,
    CompareSourceButtonFallback,
);

export default SuspensedCompareSourceButton;
