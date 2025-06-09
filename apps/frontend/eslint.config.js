import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
const config = {
  ...nextJsConfig,

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname
  },
  plugins: [...(nextJsConfig.plugins ?? []), "@typescript-eslint"],

  rules: {
    ...(nextJsConfig.rules ?? {}),
    // Add or override any custom rules here
    // Example:
    // "no-console": "warn",
  }
};

export default config;
