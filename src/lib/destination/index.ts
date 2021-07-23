import arrayEquals from "lib/utils/arrayEquals";
import immutableSpec from "./immutableSpec";
import versionsToSpecs from "./versionsToSpecs";

export type Redirect = false | "temporary" | "permanent";

export interface Destination {
    redirect: Redirect;
    immutableSpecs: [string, string];
}

/**
 * Takes specs or versions and returns the destination, which is a combination of
 * a "immutable" specs (specs that will for ever load the same version)
 * and redirect information, information if and what type of redirect we can use.
 */
export async function destination(
    specsOrVersions: [string, string],
): Promise<Destination> {
    // This part is done in npm/cli
    // https://github.com/npm/cli/blob/v7.19.1/lib/diff.js#L118
    const specs = versionsToSpecs(specsOrVersions);

    // Once we have specs, we could pass that to libnpmdiff, but we need to
    // resolve canonical absolute urls, so we do some of the resolving first.
    const immutableSpecs = await Promise.all([
        immutableSpec(specs[0]),
        immutableSpec(specs[1]),
    ]);

    if (arrayEquals(specsOrVersions, immutableSpecs)) {
        // There was no change from the raw (`specsOrVersions`) input, so it
        // was already imutable.

        return {
            redirect: false,
            immutableSpecs: specs,
        };
    } else {
        // Input was resolved to different specs, return redirect

        return {
            // If the specs (resolved versionsOrSpecs) were immutable, we can
            // use absolute redirect, since the redirect should always be the
            // same.
            redirect: arrayEquals(specs, immutableSpecs)
                ? "permanent"
                : "temporary",
            immutableSpecs,
        };
    }
}

export default destination;
