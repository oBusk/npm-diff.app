import { npmjsComIcon } from "./assets";

const NpmjsCom = Object.freeze({
    name: "npmjs.com",
    url: (packageName: string, packageVersion: string) =>
        `https://www.npmjs.com/package/${packageName}/v/${packageVersion}` as const,
    icon: npmjsComIcon,
});

export default NpmjsCom;
