import type SimplePackageSpec from "../SimplePackageSpec";
import { packagephobiaIcon } from "./assets";

const Packagephobia = Object.freeze({
    name: "Packagephobia",
    url: ({ name, version }: SimplePackageSpec) =>
        `https://packagephobia.com/result?p=${name}@${version}` as const,
    icon: packagephobiaIcon,
});

export default Packagephobia;
