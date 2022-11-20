import npa from "npm-package-arg";
import SimplePackageSpec from "./SimplePackageSpec";

export default function parseSimplePackageSpec(
    spec: string,
): SimplePackageSpec {
    const { name, rawSpec } = npa(spec);

    return {
        name: name!,
        version: rawSpec,
    };
}
