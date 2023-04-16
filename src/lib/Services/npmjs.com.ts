import SimplePackageSpec from "../SimplePackageSpec";
import { npmjsComIcon } from "./assets";

const NpmjsCom = Object.freeze({
    name: "npmjs.com",
    url: ({ name, version }: SimplePackageSpec) =>
        `https://www.npmjs.com/package/${name}/v/${version}` as const,
    icon: npmjsComIcon,
});

export default NpmjsCom;
