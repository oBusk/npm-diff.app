import NextImage from "next/image";
import algoliaLogoBlue from "./algolia-logo-blue.svg";
import algoliaLogoWhite from "./algolia-logo-white.svg";

const AlgoliaAttribution = () => (
    <li className="flex items-center justify-end gap-1.5 border-t px-3 py-1.5">
        <span className="text-xs leading-none text-muted-foreground">
            Search by
        </span>
        <a
            href="https://algolia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
        >
            <NextImage
                src={algoliaLogoBlue}
                alt="Algolia"
                width={65}
                height={15}
                className="mt-1 block dark:hidden"
            />
            <NextImage
                src={algoliaLogoWhite}
                alt="Algolia"
                width={65}
                height={15}
                className="mt-1 hidden dark:block"
            />
        </a>
    </li>
);

export default AlgoliaAttribution;
