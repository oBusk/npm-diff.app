import type { Packument } from "pacote";
import validatePackageName from "validate-npm-package-name";

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
    //  // All of this code relies on `npa()` being available, which it isn't on the edge
    //
    // const spec = npa(specStr);
    // let registry =
    //     spec.scope && opts[spec.scope.replace(/^@?/, "@") + ":registry"];

    // if (!registry && opts.scope)
    //     registry = opts[opts.scope.replace(/^@?/, "@") + ":registry"];

    // if (!registry) registry = opts.registry || defaultOpts.registry;

    // return registry;
    return defaultOpts.registry;
}

// https://github.com/npm/npm-package-arg/blob/c7571f4db7c91eac21714cbd63735fe9079fefd8/npa.js#L13-L17
const hasSlashes = /[/]/;
const isURL = /^(?:git[+])?[a-z]+:/i;
const isGit = /^[^@]+@[^:.]+\.[^:]+:.+$/i;
const isFilename = /[.](?:tgz|tar.gz|tar)$/i;

// https://github.com/npm/npm-package-arg/blob/c7571f4db7c91eac21714cbd63735fe9079fefd8/npa.js#L30-L48
function packageName(arg: string): string {
    let n: string;
    const nameEndsAt =
        arg[0] === "@" ? arg.slice(1).indexOf("@") + 1 : arg.indexOf("@");
    const namePart = nameEndsAt > 0 ? arg.slice(0, nameEndsAt) : arg;
    if (isURL.test(arg)) arg = arg;
    else if (isGit.test(arg)) arg = `git+ssh://${arg}`;
    else if (
        namePart[0] !== "@" &&
        (hasSlashes.test(namePart) || isFilename.test(namePart))
    )
        arg = arg;
    else if (nameEndsAt > 0) {
        n = namePart;
        arg = arg.slice(nameEndsAt + 1);
    } else {
        const valid = validatePackageName(arg);
        if (valid.validForOldPackages) n = arg;
        else arg = arg;
    }
    return n!;
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
    // This will not run on edge functions because it expects the node `global` object to be available.
    // const escapedName = npa(spec).escapedName;
    const name = packageName(spec);
    // https://github.com/npm/npm-package-arg/blob/c7571f4db7c91eac21714cbd63735fe9079fefd8/npa.js#L123-L124
    const escapedName = name.replaceAll("/", "%2f");
    const packumentUrl = registry.replace(/\/*$/, "/") + escapedName;

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
