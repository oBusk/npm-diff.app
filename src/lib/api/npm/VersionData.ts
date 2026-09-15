export type VersionData = {
    time: string;
    tags?: string[];
};

export type VersionMap = {
    [version: string]: VersionData;
};

export interface Version extends VersionData {
    version: string;
}
