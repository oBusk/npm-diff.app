import nextObusk from "@obusk/eslint-config-next";

const eslintConfig = [
    ...nextObusk,
    {
        name: "Temporary Overrides",
        // Temporarily disable all failing rules to be fixed 1 by 1
        rules: {
            "react-hooks/immutability": "off",
            "react-hooks/set-state-in-effect": "off",
            "react-hooks/refs": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-require-imports": "off",
        },
    },
];

export default eslintConfig;
