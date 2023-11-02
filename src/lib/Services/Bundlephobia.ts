import type SimplePackageSpec from "../SimplePackageSpec";
import { bundlephobiaIcon } from "./assets";

const Bundlephobia = Object.freeze({
    name: "Bundlephobia",
    url: ({ name, version }: SimplePackageSpec) =>
        `https://bundlephobia.com/package/${name}@${version}/` as const,
    icon: bundlephobiaIcon,
});

export default Bundlephobia;
