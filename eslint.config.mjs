import nextObusk from "@obusk/eslint-config-next";

const eslintConfig = [
    ...nextObusk,
    {
        rules: {
            "@typescript-eslint/ban-ts-comment": 0,
            "@typescript-eslint/no-explicit-any": 0,
            "@typescript-eslint/no-require-imports": 0,
            "@typescript-eslint/no-unused-expressions": 0,
            "@typescript-eslint/no-unused-vars": 0,
            "no-var": 0,
            "prefer-const": 0,
        },
    },
];

export default eslintConfig;
