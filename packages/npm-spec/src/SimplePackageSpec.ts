/** Simple spec for a package. We don't need full Npa Result. */
export default interface SimplePackageSpec<
    N extends string = string,
    V extends string = string,
> {
    name: N;
    version: V;
}

export function simplePackageSpecToString<T extends SimplePackageSpec>({
    name,
    version,
}: T): `${T["name"]}@${T["version"]}` {
    return `${name}@${version}` as const;
}
