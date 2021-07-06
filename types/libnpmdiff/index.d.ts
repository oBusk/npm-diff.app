// Type definitions for libnpmdiff 2.0.0
// Project: https://github.com/npm/libnpmdiff
// Definitions by: Oscar Busk <https://github.com/oBusk>

export type Specs = [string, string];

export interface Config {
    diffFiles: string[];
    where: string;
}

type Diff = (specs: Specs, config: Config) => Promise<string>;

export = Diff;
