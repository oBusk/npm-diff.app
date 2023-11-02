import type Flags from "./Flags";
import type Package from "./Package";
import type Score from "./Score";

export default interface Result {
    /** The package data which contains the name, version and other useful information */
    package: Package;
    /** The package flags (deprecated, unstable, insecure) */
    flags?: Flags;
    /** The package score */
    score: Score;
    /** The computed search score (from Elasticsearch) */
    searchScore: number;
}
