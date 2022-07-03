import { unpkgIcon } from "./assets";

const unpkg = Object.freeze({
    name: "unpkg",
    url: (packageName: string | null, packageVersion: string, path = "") =>
        `https://unpkg.com/browse/${packageName}@${packageVersion}/${path}` as const,
    icon: unpkgIcon,
});

export default unpkg;
