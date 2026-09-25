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

export interface LegacyLicense {
    type?: string;
    url?: string;
}

type Without<T, K extends PropertyKey> = {
    [P in keyof T as P extends K ? never : P]: T[P];
};

// Also allows the legacy and shorthand forms npm documents: https://docs.npmjs.com/cli/configuring-npm/package-json
export interface Manifest extends Without<
    PacoteManifest,
    "license" | "author" | "repository"
> {
    dist: PackageDist;
    _npmUser: Person;
    license?: string | LegacyLicense;
    licenses?: LegacyLicense[];
    author?: string | PacotePerson;
    repository?: string | PacoteManifest["repository"];
}

/**
 * > Example: https://registry.npmjs.org/@obusk/eslint-config-next
 */
export interface Packument extends Omit<PacotePackument, "versions"> {
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
