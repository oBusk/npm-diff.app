import { defineConfig } from "eslint/config";
import nextObusk from "@obusk/eslint-config-next";

const eslintConfig = defineConfig([
    ...nextObusk,
    {
        settings: {
            react: {
                version: "19",
            },
            tailwindcss:
                /** @type {import('eslint-plugin-tailwindcss').PluginSettings} */
                ({
                    cssConfigPath: "./src/app/globals.css",
                    functions: ["clsx", "cx", "cva", "twMerge", "tw"],
                }),
        },
    },
]);

export default eslintConfig;
