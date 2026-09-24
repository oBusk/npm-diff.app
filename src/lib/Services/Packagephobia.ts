import type SimplePackageSpec from "../SimplePackageSpec";
import { packagephobiaIcon } from "./assets";

const Packagephobia = Object.freeze({
    name: "Packagephobia",
    url: ({ name, version }: SimplePackageSpec): string => {
        const url = new URL("https://packagephobia.com/result");
        url.searchParams.set("p", `${name}@${version}`);
        return url.toString();
    },
    icon: packagephobiaIcon,
});

export default Packagephobia;
