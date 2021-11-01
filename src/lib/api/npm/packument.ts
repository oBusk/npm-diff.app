import npa from "npm-package-arg";
import type { Packument } from "pacote";

// https://github.dev/npm/npm-registry-fetch/blob/9cd725786b1362df268afda7b6e2a6c3db8ab05e/default-opts.js#L2-L21
const defaultOpts = {
    // log: require("./silentlog.js"),
    maxSockets: 12,
    method: "GET",
    registry: "https://registry.npmjs.org/",
    timeout: 5 * 60 * 1000, // 5 minutes
    strictSSL: true,
    noProxy: process.env.NOPROXY,
    // userAgent: `${pkg.name
    //   }@${
    //     pkg.version
    //   }/node@${
    //     process.version
    //   }+${
    //     process.arch
    //   } (${
    //     process.platform
    //   })`,
};

// https://github.com/npm/npm-registry-fetch/blob/9cd725786b1362df268afda7b6e2a6c3db8ab05e/index.js#L175-L189
function pickRegistry(specStr: string, opts: any = {}) {
    const spec = npa(specStr);
    let registry =
        spec.scope && opts[spec.scope.replace(/^@?/, "@") + ":registry"];

    if (!registry && opts.scope)
        registry = opts[opts.scope.replace(/^@?/, "@") + ":registry"];

    if (!registry) registry = opts.registry || defaultOpts.registry;

    return registry;
}

// https://github.com/npm/pacote/blob/bd67be1ea53ab02c2be781a3fc2283eb9fcba3c8/lib/registry.js#L76
/**
 * Own very simple implementation of `packument` to get packument from registry without using `pacote`.
 *
 * `pacote` and most other npm packages use various caching which relies on `fs` which cannot load in
 * edge functions.
 */
export default async function packument(spec: string, opts?: RequestInit) {
    const registry = pickRegistry(spec, opts);
    const packumentUrl = registry.replace(/\/*$/, "/") + npa(spec).escapedName;

    const p = await fetch(packumentUrl, {
        ...defaultOpts,
        ...opts,
        headers: {},
        // never check integrity for packuments themselves
        integrity: undefined,
    });
    const pack: Packument = await p.json();

    return pack;
}
