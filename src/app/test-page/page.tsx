// import edgeNpa, { resolve as edgeResolve } from "@obusk/edge-npm-package-arg";
import { packument } from "@obusk/edge-pacote";
// import realNpa, { resolve as realResolve } from "npm-package-arg";

export const runtime = "edge";

export default async function TestPage() {
    const result = await packument("npm-package-arg");
    // const parsed = edgeNpa("npm-package-arg@6.1.0");
    // const parsed2 = realNpa("npm-package-arg@6.1.0");

    // console.log(npa2);
    // console.log(realResolve);

    // const resolved = await edgeResolve("npm-package-arg", "^6.0.0");
    // const resolved2 = await realResolve("npm-package-arg", "^6.0.0");

    return (
        <>
            <pre>{JSON.stringify(result, null, 2)}</pre>
            {/* <pre>{JSON.stringify(parsed, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(parsed2, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(resolved, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(resolved2, null, 2)}</pre> */}
        </>
    );
}
