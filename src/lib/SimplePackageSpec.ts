import npa from "npm-package-arg";

/** Simple spec for a package. We don't need full Npa Result. */
export default interface SimplePackageSpec {
    name: string;
    version: string;
}

export function createSimplePackageSpec(spec: string): SimplePackageSpec {
    const { name, rawSpec } = npa(spec);

    return {
        name: name!,
        version: rawSpec,
    };
}
