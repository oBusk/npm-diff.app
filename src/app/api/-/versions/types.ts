import { type VersionData } from "^/lib/api/npm/getVersionData";

export const VERSIONS_PARAMETER_PACKAGE = "package";
export interface Version extends VersionData {
    version: string;
}
export type SpecsEndpointResponse = Version[];
