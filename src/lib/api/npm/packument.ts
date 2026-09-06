import { cacheLife } from "next/cache";
import npa from "npm-package-arg";
import { packument as pacotePackument } from "pacote";
import type {
    Manifest as PacoteManifest,
    PackageDist as PacotePackageDist,
    Packument as PacotePackument,
    Person as PacotePerson,
} from "pacote";

export interface ProvenanceReference {
    predicateType: string;
}

export interface PackageDistAttestations {
    url: string;
    provenance: ProvenanceReference;
}

export interface PackageDist extends PacotePackageDist {
    attestations?: PackageDistAttestations;
}

export interface TrustedPublisher {
    /** E.g. "github" */
    id: string;
    /** E.g "oidc:12345678-1234-1234-1234-1234567890ab" */
    oidcConfigId: string;
}

export interface Person extends PacotePerson {
    trustedPublisher?: TrustedPublisher;
}

export interface Manifest extends PacoteManifest {
    dist: PackageDist;
    _npmUser: Person;
}

/**
 * > Example: https://registry.npmjs.org/@obusk/eslint-config-next
 */
export interface Packument extends PacotePackument {
    versions: Record<string, Manifest>;
}

async function packumentForPackage(packageName: string): Promise<Packument> {
    "use cache";

    cacheLife("hours");

    return pacotePackument(packageName, {
        fullMetadata: true,
        // Make sure we don't cache on disk
        cache: undefined,
    }) as Promise<Packument>;
}

export default function packument(spec: string): Promise<Packument> {
    const { name } = npa(spec);

    if (!name) {
        throw new Error(`Could not extract package name from: ${spec}`);
    }

    return packumentForPackage(name);
}
