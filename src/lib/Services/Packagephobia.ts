import { packagephobiaIcon } from "./assets";

const Packagephobia = Object.freeze({
    name: "Packagephobia",
    url: (packageName: string, packageVersion: string) =>
        `https://packagephobia.com/result?p=${packageName}@${packageVersion}` as const,
    icon: packagephobiaIcon,
});

export default Packagephobia;
