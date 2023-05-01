import Link from "next/link";
import { FunctionComponent } from "react";
import ColorModeToggle from "./ColorModeToggle";
import { GithubLink } from "./GithubLink";
import NavLink from "./NavLink";

const Header: FunctionComponent = () => (
    <nav className="sticky inset-x-0 top-0 z-20 flex items-center justify-between bg-background px-4 py-6">
        <div className="flex items-center">
            <GithubLink variant="ghost" className="mr-4" />
            <ColorModeToggle variant="ghost" />
        </div>
        <Link
            href="/"
            className="block rounded-md transition-all duration-200 hover:no-underline focus:outline-none"
        >
            <h1 className="text-xl font-bold sm:text-2xl lg:text-4xl">
                npm-diff.app 📦🔃
            </h1>
        </Link>
        <div className="flex items-center justify-end">
            <NavLink href="/about">about</NavLink>
            <span>/</span>
            <NavLink href="/about/api">api</NavLink>
        </div>
    </nav>
);

export default Header;
