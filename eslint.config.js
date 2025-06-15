// eslint.config.js
import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tailwindcss from "eslint-plugin-tailwindcss";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  // 1. Core ESLint rules for JavaScript
  js.configs.recommended,

  // 2. TypeScript support
  ...ts.configs.recommended,

  // 3. React best practices
  {
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      tailwindcss,
      prettier: prettierPlugin,
    },
    settings: {
      react: { version: "detect" },
      tailwindcss: {
        config: "tailwind.config.js",
        cssFiles: ["**/*.css"],
        removeDuplicates: true,
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...tailwindcss.configs["flat/recommended"].rules,
      "prettier/prettier": "error",
    },
  },

  // 4. Ensure Tailwind classes are linted
  tailwindcss.configs["flat/recommended"],

  // 5. Run Prettier via ESLint
  {
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },

  // 6. Turn off conflicting rules using Prettier's config
  eslintConfigPrettier,
];