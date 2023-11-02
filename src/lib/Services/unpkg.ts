import type SimplePackageSpec from "../SimplePackageSpec";
import { unpkgIcon } from "./assets";

const unpkg = Object.freeze({
    name: "unpkg",
    url: ({ name, version }: SimplePackageSpec, path = "") =>
        `https://unpkg.com/browse/${name}@${version}/${path}` as const,
    icon: unpkgIcon,
});

export default unpkg;
