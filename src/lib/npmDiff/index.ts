import type { NpmDiffError } from "./Error";
import npmDiff from "./npmDiff";
import type { NpmDiffResult } from "./npmDiff";
import type Options from "./Options";

export default npmDiff;
export {
    type Options as NpmDiffOptions,
    type NpmDiffError,
    type NpmDiffResult,
};
