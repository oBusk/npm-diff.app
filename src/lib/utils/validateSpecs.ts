import npa, { type AliasResult } from "npm-package-arg";
import validatePackageName from "validate-npm-package-name";

const ALLOWED_TYPES = new Set(["version", "range", "tag", "alias"]);

function validateSpec(parsed: npa.Result): boolean {
    if (!ALLOWED_TYPES.has(parsed.type)) {
        return false;
    }
    if (parsed.type === "alias") {
        return validateSpec((parsed as AliasResult).subSpec);
    }
    if (parsed.name) {
        const validation = validatePackageName(parsed.name);
        if (
            !validation.validForNewPackages &&
            !validation.validForOldPackages
        ) {
            return false;
        }
    }
    return true;
}

export default function validateSpecs(specs: string[]): boolean {
    for (const spec of specs) {
        try {
            if (!validateSpec(npa(spec))) {
                return false;
            }
        } catch {
            return false;
        }
    }
    return true;
}
