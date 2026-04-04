// @ts-check
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // ─── Global ignores ─────────────────────────────────────────────────────────
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },

  // ─── TypeScript recommended + type-aware rules (all .ts files) ──────────────
  {
    files: ["**/*.ts"],
    extends: [
      tseslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Warn on non-null assertions — prefer proper null checks
      "@typescript-eslint/no-non-null-assertion": "warn",

      // Require explicit return types on exported functions
      "@typescript-eslint/explicit-module-boundary-types": "warn",

      // Disallow unused variables (replaces the base JS rule)
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Prefer const where re-assignment never happens
      "prefer-const": "error",
    },
  },

  // ─── Playwright-specific rules (test & spec files) ──────────────────────────
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**/*.ts", "**/*.spec.ts", "**/*.test.ts"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,

      // Hard-fail on page.pause() left in committed code
      "playwright/no-page-pause": "error",

      // Warn on committed skipped tests
      "playwright/no-skipped-test": "warn",

      // Enforce web-first assertions (toBeVisible, toHaveText, …)
      "playwright/prefer-web-first-assertions": "error",

      // Note: missing-await / floating promises for async tests is
      // covered by @typescript-eslint/no-floating-promises (see TS block above)
    },
  },

  // ─── Prettier: disable ESLint rules that conflict with formatting ─────────────
  prettierConfig,
);
