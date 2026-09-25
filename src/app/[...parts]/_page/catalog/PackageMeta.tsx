import ClientDate from "^/components/ClientDate";
import ExternalLink from "^/components/ExternalLink";
import BorderBox from "^/components/ui/BorderBox";
import Heading from "^/components/ui/Heading";
import Stack from "^/components/ui/Stack";
import type { CatalogSummary } from "^/lib/api/npm/catalogSummary";

export interface PackageMetaProps {
    summary: CatalogSummary;
}

/**
 * Left column showing package metadata
 */
export default function PackageMeta({ summary }: PackageMetaProps) {
    const { latest } = summary;

    if (!latest) {
        return null;
    }

    const npmUrl = `https://www.npmjs.com/package/${summary.name}`;
    const { repositoryUrl, homepageUrl, keywords } = latest;

    // Calculate total versions
    const totalVersions = summary.versions.length;

    return (
        <BorderBox className="flex h-fit flex-col gap-4">
            <Stack direction="v" gap={2}>
                <Heading h={2} className="text-2xl">
                    {summary.name}
                </Heading>
                <div className="text-sm text-muted-foreground">
                    <span className="font-mono">{latest.version}</span>
                    {latest.time ? (
                        <>
                            <span className="mx-2">•</span>
                            <ClientDate time={latest.time} />
                        </>
                    ) : null}
                </div>
            </Stack>

            {latest.description ? (
                <p className="text-sm text-muted-foreground">
                    {latest.description}
                </p>
            ) : null}

            <Stack direction="v" gap={2}>
                {latest.license ? (
                    <div className="text-sm">
                        <span className="text-muted-foreground">License: </span>
                        <span>{latest.license}</span>
                    </div>
                ) : null}

                {latest.author ? (
                    <div className="text-sm">
                        <span className="text-muted-foreground">Author: </span>
                        <span>{latest.author}</span>
                    </div>
                ) : null}

                {totalVersions > 0 && (
                    <div className="text-sm">
                        <span className="text-muted-foreground">
                            Versions:{" "}
                        </span>
                        <span>{totalVersions}</span>
                    </div>
                )}

                {latest.maintainersCount > 0 ? (
                    <div className="text-sm">
                        <span className="text-muted-foreground">
                            Maintainers:{" "}
                        </span>
                        <span>{latest.maintainersCount}</span>
                    </div>
                ) : null}
            </Stack>

            {keywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {keywords.slice(0, 10).map((keyword) => (
                        <span
                            key={keyword}
                            className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                        >
                            {keyword}
                        </span>
                    ))}
                </div>
            ) : null}

            <Stack direction="v" gap={2}>
                <ExternalLink
                    href={npmUrl}
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                    View on npm →
                </ExternalLink>

                {repositoryUrl ? (
                    <ExternalLink
                        href={repositoryUrl}
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Repository →
                    </ExternalLink>
                ) : null}

                {homepageUrl && homepageUrl !== repositoryUrl ? (
                    <ExternalLink
                        href={homepageUrl}
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Homepage →
                    </ExternalLink>
                ) : null}
            </Stack>
        </BorderBox>
    );
}
