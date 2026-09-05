import npmDiff from "./npmDiff";
import type { NpmDiffResult } from "./npmDiff";
import type { NpmDiffError } from "./NpmDiffError";
import type Options from "./Options";

export default npmDiff;
export {
    type Options as NpmDiffOptions,
    type NpmDiffError,
    type NpmDiffResult,
};
