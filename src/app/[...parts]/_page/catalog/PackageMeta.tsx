import { Github, Gitlab, type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import ClientDate from "^/components/ClientDate";
import ExternalLink from "^/components/ExternalLink";
import BorderBox from "^/components/ui/BorderBox";
import Heading from "^/components/ui/Heading";
import Stack from "^/components/ui/Stack";
import type {
    CatalogLink,
    CatalogRepositoryHost,
    CatalogSummary,
} from "^/lib/api/npm/catalogSummary";

const repositoryHosts: Record<
    CatalogRepositoryHost,
    { label: string; Icon: LucideIcon }
> = {
    github: { label: "GitHub", Icon: Github },
    gitlab: { label: "GitLab", Icon: Gitlab },
};

interface MetaLinkProps {
    label: string;
    link: CatalogLink;
    children?: ReactNode;
}

function MetaLink({ label, link, children = link.text }: MetaLinkProps) {
    return (
        <div className="truncate text-sm">
            <span className="text-muted-foreground">{label}: </span>
            {link.href ? (
                <ExternalLink
                    href={link.href}
                    title={link.href}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                >
                    {children}
                </ExternalLink>
            ) : (
                <span title={link.text}>{children}</span>
            )}
        </div>
    );
}

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
    const { repository, homepage, keywords } = latest;
    const repositoryHost = repository?.host && repositoryHosts[repository.host];

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

                {repository ? (
                    <MetaLink label="Repository" link={repository}>
                        {repositoryHost ? (
                            <repositoryHost.Icon
                                aria-label={repositoryHost.label}
                                className="mr-1 inline size-4 align-text-bottom"
                            />
                        ) : null}
                        {repository.text}
                        {repository.directory ? (
                            <span className="opacity-70">
                                /{repository.directory}
                            </span>
                        ) : null}
                    </MetaLink>
                ) : null}

                {homepage ? (
                    <MetaLink label="Homepage" link={homepage} />
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
            </Stack>
        </BorderBox>
    );
}
