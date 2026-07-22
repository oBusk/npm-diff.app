import Link from "next/link";
import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "^/lib/cva";

interface FooterProps extends HTMLAttributes<HTMLDivElement> {}

const popularPackages = [
    "react",
    "next",
    "vue",
    "typescript",
    "express",
    "lodash",
    "axios",
];

const Footer = forwardRef<HTMLDivElement, FooterProps>(
    ({ className, ...props }, ref) => (
        <footer
            className={cx(
                "flex flex-col gap-6 border-t border-border py-8",
                className,
            )}
            {...props}
            ref={ref}
        >
            <div className="mx-auto w-full max-w-7xl px-4">
                {/* Popular Packages Section */}
                <div className="mb-6">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Popular Packages
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {popularPackages.map((pkg) => (
                            <Link
                                key={pkg}
                                href={`/${pkg}`}
                                className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                {pkg}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Footer Links */}
                <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <Link
                            href="/-/about"
                            className="hover:text-foreground hover:underline"
                        >
                            About
                        </Link>
                        <Link
                            href="/-/about/api"
                            className="hover:text-foreground hover:underline"
                        >
                            API
                        </Link>
                        <Link
                            href="/-/about/source-trust"
                            className="hover:text-foreground hover:underline"
                        >
                            Source Trust
                        </Link>
                        <a
                            href="https://github.com/oBusk/npm-diff.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground hover:underline"
                        >
                            GitHub
                        </a>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        © 2026 npm-diff.app
                    </div>
                </div>
            </div>
        </footer>
    ),
);
Footer.displayName = "Footer";

export default Footer;
