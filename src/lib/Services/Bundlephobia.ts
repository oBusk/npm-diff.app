import { bundlephobiaIcon } from "./assets";

const Bundlephobia = Object.freeze({
    name: "Bundlephobia",
    url: (packageName: string, packageVersion: string) =>
        `https://bundlephobia.com/package/${packageName}@${packageVersion}/` as const,
    icon: bundlephobiaIcon,
});

export default Bundlephobia;
