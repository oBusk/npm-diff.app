import npa from "npm-package-arg";
import type SimplePackageSpec from "./SimplePackageSpec";

// Because this function relies on "npm-package-arg",
// It's important to keep in it's own file since it can only be imported in the server.

export function createSimplePackageSpec(spec: string): SimplePackageSpec {
    const { name, rawSpec } = npa(spec);

    return {
        name: name!,
        version: rawSpec,
    };
}
