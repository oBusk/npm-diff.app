import npa from "npm-package-arg";
import validatePackageName from "validate-npm-package-name";

const ALLOWED_TYPES = new Set(["version", "range", "tag", "alias"]);

export default function validateSpecs(specs: string[]): boolean {
    for (const spec of specs) {
        try {
            const parsed = npa(spec);
            if (!ALLOWED_TYPES.has(parsed.type)) {
                return false;
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
        } catch {
            return false;
        }
    }
    return true;
}
