import reactHooksPlugin from "eslint-plugin-react-hooks";

import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import noOnlyTestsPlugin from "eslint-plugin-no-only-tests";
import queryPlugin from "@tanstack/eslint-plugin-query";
import perfectionist from "eslint-plugin-perfectionist";
import nextPlugin from "@next/eslint-plugin-next";
import promisePlugin from "eslint-plugin-promise";
import wokePlugin from "eslint-plugin-woke";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import * as espree from "espree";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";

export default [
  perfectionist.configs["recommended-natural"],
  eslintPluginPrettierRecommended,
  ...queryPlugin.configs["flat/recommended"],
  promisePlugin.configs["flat/recommended"],
  // Configuration pour JavaScript
  {
    rules: {
      "no-console": ["error", { allow: ["warn", "error", "info", "debug"] }],
      "no-only-tests/no-only-tests": "error",
      "react-hooks/exhaustive-deps": "off",

      "@next/next/no-img-element": "off",
      "prettier/prettier": "error",
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      "perfectionist/sort-imports": [
        "error",
        {
          groups: [
            "type",
            "react",
            "nanostores",
            ["builtin", "external"],
            "internal-type",
            "internal",
            ["parent-type", "sibling-type", "index-type"],
            ["parent", "sibling", "index"],
            "side-effect",
            "style",
            "object",
            "unknown",
          ],
          // Correction ici (customGroups au lieu de custom-groups)
          customGroups: {
            value: {
              nanostores: "@nanostores/.*",
              react: ["react", "react-*"],
            },
            type: {
              react: "react",
            },
          },
          // Correction ici (internalPattern au lieu de internal-pattern)
          internalPattern: [
            "@/components/.*",
            "@/services/.*",
            "@/constants/.*",
            "@/helpers/.*",
            "@/app/actions.*",
          ],
          newlinesBetween: "always",
          type: "line-length",
          order: "desc",
        },
      ],
      "perfectionist/sort-objects": [
        "warn",
        {
          type: "line-length",
          order: "desc",
        },
      ],
      "perfectionist/sort-enums": [
        "error",
        {
          type: "line-length",
          order: "desc",
        },
      ],

      "promise/always-return": "off",

      "woke/all": "warn",
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/anchor-has-content": "off",
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      parser: espree,
    },
    plugins: {
      "no-only-tests": noOnlyTestsPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
      woke: wokePlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
  },
  // Configuration pour TypeScript
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "no-only-tests": noOnlyTestsPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
      woke: wokePlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    rules: {
      // Hérite des règles de base
      "no-console": ["error", { allow: ["warn", "error", "info", "debug"] }],
      "no-only-tests/no-only-tests": "error",
      "react-hooks/exhaustive-deps": "off",
      "@next/next/no-img-element": "off",
      "prettier/prettier": "error",
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // Règles TypeScript spécifiques
      ...tsPlugin.configs.recommended.rules,
      ...tsPlugin.configs["recommended-type-checked"].rules,
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/strict-boolean-expressions": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",

      // Règles perfectionist pour TypeScript
      "perfectionist/sort-imports": [
        "error",
        {
          groups: [
            "type",
            "react",
            "nanostores",
            ["builtin", "external"],
            "internal-type",
            "internal",
            ["parent-type", "sibling-type", "index-type"],
            ["parent", "sibling", "index"],
            "side-effect",
            "style",
            "object",
            "unknown",
          ],
          customGroups: {
            value: {
              nanostores: "@nanostores/.*",
              react: ["react", "react-*"],
            },
            type: {
              react: "react",
            },
          },
          internalPattern: [
            "@/components/.*",
            "@/services/.*",
            "@/constants/.*",
            "@/helpers/.*",
            "@/app/actions.*",
          ],
          newlinesBetween: "always",
          type: "line-length",
          order: "desc",
        },
      ],
      "perfectionist/sort-objects": [
        "warn",
        {
          type: "line-length",
          order: "desc",
        },
      ],
      "perfectionist/sort-enums": [
        "error",
        {
          type: "line-length",
          order: "desc",
        },
      ],
      "promise/always-return": "off",
      "woke/all": "warn",
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/anchor-has-content": "off",
    },
  },
];
