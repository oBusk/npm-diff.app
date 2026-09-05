import npa from "npm-package-arg";
import validatePackageName from "validate-npm-package-name";

export default function validateSpecs(specs: string[]): boolean {
    for (const spec of specs) {
        try {
            const parsed = npa(spec);
            if (parsed.type === "directory" || parsed.type === "file") {
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
