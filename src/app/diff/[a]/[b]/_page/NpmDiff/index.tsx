import suspense from "^/lib/suspense";
import NpmDiff from "./NpmDiff";
import NpmDiffSkeleton from "./NpmDiff.skeleton";

const SuspendedNpmDiff = suspense(NpmDiff, NpmDiffSkeleton);

export default SuspendedNpmDiff;
