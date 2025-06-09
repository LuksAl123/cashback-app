import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      js,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
    extends: ["js:recommended"],
  },
  ...tseslint.configs.recommended,
];
