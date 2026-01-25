import Link from "next/link";
import { type CatalogLink } from "^/lib/catalog/generateCatalogLinks";

interface CatalogPageProps {
    packageName: string;
    links: CatalogLink[];
}

const CatalogPage = ({ packageName, links }: CatalogPageProps) => {
    // Group links by type
    const patchLinks = links.filter((l) => l.type === "patch");
    const minorLinks = links.filter((l) => l.type === "minor");
    const majorLinks = links.filter((l) => l.type === "major");

    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-8 p-6">
            <header>
                <h1 className="mb-2 text-4xl font-bold">{packageName}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Choose a version comparison to view changes
                </p>
            </header>

            {majorLinks.length > 0 && (
                <section>
                    <h2 className="mb-4 text-2xl font-semibold">
                        Major Version Updates
                    </h2>
                    <div className="flex flex-col gap-2">
                        {majorLinks.map((link) => (
                            <Link
                                key={`${link.from}...${link.to}`}
                                href={`/${link.from}...${link.to}`}
                                prefetch={false}
                                className="rounded-lg border border-gray-300 p-4 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                <span className="font-mono text-sm">
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {minorLinks.length > 0 && (
                <section>
                    <h2 className="mb-4 text-2xl font-semibold">
                        Minor Version Updates
                    </h2>
                    <div className="flex flex-col gap-2">
                        {minorLinks.map((link) => (
                            <Link
                                key={`${link.from}...${link.to}`}
                                href={`/${link.from}...${link.to}`}
                                prefetch={false}
                                className="rounded-lg border border-gray-300 p-4 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                <span className="font-mono text-sm">
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {patchLinks.length > 0 && (
                <section>
                    <h2 className="mb-4 text-2xl font-semibold">
                        Patch Version Updates
                    </h2>
                    <div className="flex flex-col gap-2">
                        {patchLinks.map((link) => (
                            <Link
                                key={`${link.from}...${link.to}`}
                                href={`/${link.from}...${link.to}`}
                                prefetch={false}
                                className="rounded-lg border border-gray-300 p-4 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                <span className="font-mono text-sm">
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {links.length === 0 && (
                <div className="py-12 text-center text-gray-600 dark:text-gray-400">
                    <p>No version comparisons available for this package.</p>
                </div>
            )}
        </div>
    );
};

export default CatalogPage;
