import { packument } from "pacote";

export interface Version {
    name: string;
    version: string;
}

async function getAllVersions(spec: string): Promise<Version[]> {
    const result = await packument(spec);

    return Object.values(result.versions).map(({ name, version }) => ({
        name,
        version,
    }));
}

export default getAllVersions;
