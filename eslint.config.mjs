import nextObusk from "@obusk/eslint-config-next";

const eslintConfig = [
    ...nextObusk,
    {
        name: "Temporary Overrides",
        // Temporarily disable all failing rules to be fixed 1 by 1
        rules: {},
    },
];

export default eslintConfig;
