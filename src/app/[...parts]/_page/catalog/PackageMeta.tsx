import ClientDate from "^/components/ClientDate";
import ExternalLink from "^/components/ExternalLink";
import BorderBox from "^/components/ui/BorderBox";
import Heading from "^/components/ui/Heading";
import Stack from "^/components/ui/Stack";
import type { Packument } from "^/lib/api/npm/packument";

export interface PackageMetaProps {
    packument: Packument;
}

/**
 * Left column showing package metadata
 */
export default function PackageMeta({ packument }: PackageMetaProps) {
    const latestVersion = packument["dist-tags"].latest;
    const latestManifest = packument.versions[latestVersion];

    if (!latestManifest) {
        return null;
    }

    const latestTime = packument.time[latestVersion];
    const npmUrl = `https://www.npmjs.com/package/${packument.name}`;
    const repositoryUrl =
        typeof latestManifest.repository === "string"
            ? latestManifest.repository
            : latestManifest.repository?.url
                  ?.replace(/^git\+/, "")
                  .replace(/\.git$/, "");
    const homepageUrl = latestManifest.homepage;

    // Calculate total versions
    const totalVersions = Object.keys(packument.versions).length;

    // Get keywords
    const keywords = latestManifest.keywords;

    return (
        <BorderBox className="flex h-fit flex-col gap-4">
            <Stack direction="v" gap={2}>
                <Heading h={2} className="text-2xl">
                    {packument.name}
                </Heading>
                <div className="text-sm text-muted-foreground">
                    <span className="font-mono">{latestVersion}</span>
                    {latestTime ? (
                        <>
                            <span className="mx-2">•</span>
                            <ClientDate time={latestTime} />
                        </>
                    ) : null}
                </div>
            </Stack>

            {latestManifest.description ? (
                <p className="text-sm text-muted-foreground">
                    {latestManifest.description}
                </p>
            ) : null}

            <Stack direction="v" gap={2}>
                {latestManifest.license ? (
                    <div className="text-sm">
                        <span className="text-muted-foreground">License: </span>
                        <span>{latestManifest.license}</span>
                    </div>
                ) : null}

                {latestManifest.author ? (
                    <div className="text-sm">
                        <span className="text-muted-foreground">Author: </span>
                        <span>
                            {typeof latestManifest.author === "string"
                                ? latestManifest.author
                                : latestManifest.author.name}
                        </span>
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

                {Boolean(
                    latestManifest.maintainers &&
                    latestManifest.maintainers.length > 0,
                ) && (
                    <div className="text-sm">
                        <span className="text-muted-foreground">
                            Maintainers:{" "}
                        </span>
                        <span>{latestManifest.maintainers?.length}</span>
                    </div>
                )}
            </Stack>

            {Boolean(keywords && keywords.length > 0) && (
                <div className="flex flex-wrap gap-2">
                    {keywords?.slice(0, 10).map((keyword, index) => (
                        <span
                            key={index}
                            className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                        >
                            {keyword}
                        </span>
                    ))}
                </div>
            )}

            <Stack direction="v" gap={2}>
                <ExternalLink
                    href={npmUrl}
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                    View on npm →
                </ExternalLink>

                {Boolean(repositoryUrl) && (
                    <ExternalLink
                        href={repositoryUrl!}
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Repository →
                    </ExternalLink>
                )}

                {Boolean(homepageUrl && homepageUrl !== repositoryUrl) && (
                    <ExternalLink
                        href={homepageUrl!}
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Homepage →
                    </ExternalLink>
                )}
            </Stack>
        </BorderBox>
    );
}
