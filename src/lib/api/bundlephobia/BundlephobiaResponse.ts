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

interface BundlephobiaResponse {
    name: string;
    version: string;
    description: string;
    scoped: boolean;
    repository: string;

    gzip: number;
    size: number;

    hasJSModule: false | string;
    hasJSNext: false | string;
    hasSideEffects: boolean | string[];
    isModuleType: boolean;
    dependencyCount: number;

    assets: BundlephobiaResponseAsset[];
    dependencySizes: BundlephobiaResponseDependencySize[];
}

export default BundlephobiaResponse;
