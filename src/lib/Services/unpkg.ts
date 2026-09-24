import type SimplePackageSpec from "../SimplePackageSpec";
import { unpkgIcon } from "./assets";

const encodePath = (path: string) =>
    path.split("/").map(encodeURIComponent).join("/");

const unpkg = Object.freeze({
    name: "unpkg",
    url: ({ name, version }: SimplePackageSpec, path = ""): string =>
        `https://unpkg.com/browse/${name}@${encodeURIComponent(version)}/${encodePath(path)}`,
    icon: unpkgIcon,
});

export default unpkg;
