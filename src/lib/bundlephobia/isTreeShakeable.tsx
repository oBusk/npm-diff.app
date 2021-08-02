import { BundlephobiaResponse } from "lib/bundlephobia/BundlephobiaResponse";

export function isTreeShakeable(p: BundlephobiaResponse): boolean {
    // Based on functionality in bundlephobia:
    // https://github.com/pastelsky/bundlephobia/blob/28bde79/pages/package/%5B...packageString%5D/ResultPage.js#L302-L304
    return Boolean(p.hasJSModule || p.hasJSNext || p.isModuleType);
}
