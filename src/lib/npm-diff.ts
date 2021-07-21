import libnpmdiff from "libnpmdiff";
import { arrayEquals } from "./array-equals";
import getAbsoluteSpecs from "./get-absolute-specs";
import parseQuery, { QueryParams } from "./parse-query";
import { versionsToSpecs } from "./versions-to-specs";

interface NpmDiffResult {
    type: "result";
    diff: string;
}

interface NpmDiffRedirect {
    type: "redirect";
    destinationDiff: string;
    permanent: boolean;
}

// TODO: Split this up into `getRedirect` and `npmDiff`
/**
 * Main method for taking two raw specs/versions and either returning
 * the diff, or a redirect.
 */
export async function npmDiff(
    specsOrVersions: [string, string],
    query: QueryParams = {},
): Promise<NpmDiffResult | NpmDiffRedirect> {
    // This part is done in npm/cli
    // https://github.com/npm/cli/blob/v7.19.1/lib/diff.js#L118
    const specs = versionsToSpecs(specsOrVersions);

    // Once we have specs, we could pass that to libnpmdiff, but we need to
    // resolve canonical absolute urls, so we do some of the resolving first.
    const immutableSpecs = await getAbsoluteSpecs(specs);

    // Must compare RAW input with final result
    if (arrayEquals(specsOrVersions, immutableSpecs)) {
        // Input was immutable, return diff

        return {
            type: "result",
            diff: await libnpmdiff(specs, parseQuery(query)),
        };
    } else {
        // Input was resolved to different specs, return redirect

        return {
            type: "redirect",
            destinationDiff: `${immutableSpecs[0]}...${immutableSpecs[1]}`,
            // If specs and immutableSpecs are equal, we can do a permanent redirect
            permanent: arrayEquals(specs, immutableSpecs),
        };
    }
}

export default npmDiff;
