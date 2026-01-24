"use client";

import { Menu, X } from "lucide-react";
import { forwardRef, Suspense, useState } from "react";
import Button from "^/components/ui/Button";
import { cx } from "^/lib/cva";
import NavLink, { NavLinkFallback } from "./NavLink";

export interface MobileMenuProps {}

const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>((props, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <div className="relative" ref={ref} {...props}>
            <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
                className="p-2"
            >
                {isOpen ? (
                    <X className="size-6" />
                ) : (
                    <Menu className="size-6" />
                )}
            </Button>

            {isOpen ? (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={closeMenu}
                        aria-hidden="true"
                    />
                    <div
                        className={cx(
                            "absolute right-0 top-full z-50 mt-2 w-48",
                            "rounded-md border border-input bg-background shadow-lg",
                        )}
                    >
                        <div className="flex flex-col gap-2 p-2">
                            <Suspense
                                fallback={
                                    <>
                                        <NavLinkFallback
                                            href="/about"
                                            className="w-full justify-start"
                                            onClick={closeMenu}
                                        >
                                            About
                                        </NavLinkFallback>
                                        <NavLinkFallback
                                            href="/about/api"
                                            className="w-full justify-start"
                                            onClick={closeMenu}
                                        >
                                            API
                                        </NavLinkFallback>
                                        <NavLinkFallback
                                            href="/-/about/source-trust"
                                            className="w-full justify-start"
                                            onClick={closeMenu}
                                        >
                                            Trust
                                        </NavLinkFallback>
                                    </>
                                }
                            >
                                <NavLink
                                    href="/about"
                                    className="w-full justify-start"
                                    onClick={closeMenu}
                                >
                                    About
                                </NavLink>
                                <NavLink
                                    href="/about/api"
                                    className="w-full justify-start"
                                    onClick={closeMenu}
                                >
                                    API
                                </NavLink>
                                <NavLink
                                    href="/-/about/source-trust"
                                    className="w-full justify-start"
                                    onClick={closeMenu}
                                >
                                    Trust
                                </NavLink>
                            </Suspense>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
});
MobileMenu.displayName = "MobileMenu";

export default MobileMenu;
