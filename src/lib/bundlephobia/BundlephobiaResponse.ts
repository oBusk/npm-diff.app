export interface BundlephobiaResponseAsset {
    name: string;
    type: string;
    size: number;
    gzip: number;
}

export interface BundlephobiaResponseDependencySize {
    name: string;
    approximateSize: number;
}

export interface BundlephobiaResponse {
    name: string;
    version: string;
    description: string;
    scoped: boolean;
    repository: string;

    gzip: number;
    size: number;

    hasJSModule: false | string;
    hasJSNext: false | string;
    hasSideEffects: boolean;
    isModuleType: boolean;
    dependencyCount: number;

    assets: BundlephobiaResponseAsset[];
    dependencySizes: BundlephobiaResponseDependencySize[];
}
