declare function validatePackageName(name: string): {
    validForNewPackages: boolean;
    validForOldPackages: boolean;
    warnings: string[];
    errors: string[];
};

export default validatePackageName;
