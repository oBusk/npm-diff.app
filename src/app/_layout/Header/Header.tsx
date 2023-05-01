import Link from "next/link";
import { FunctionComponent } from "react";
import ColorModeToggle from "./ColorModeToggle";
import { GithubLink } from "./GithubLink";
import NavLink from "./NavLink";

const Header: FunctionComponent = () => (
    <nav className="bg-background flex items-center justify-between px-4 py-6 sticky top-0 left-0 right-0 z-20 ">
        <div className="flex items-center">
            <GithubLink variant="ghost" className="mr-4" />
            <ColorModeToggle variant="ghost" />
        </div>
        <Link
            href="/"
            className="block transition-all duration-200 rounded-md focus:outline-none hover:no-underline"
        >
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold">
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
