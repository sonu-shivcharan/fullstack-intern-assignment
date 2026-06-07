//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  ...tanstackConfig,
  {
    plugins: ["import-x"],
    rules: {
      "import/no-cycle": "off",
      "import/order": "off",
      "sort-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "pnpm/json-enforce-catalog": "off",
      "import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
    },
  },
  {
    ignores: ["eslint.config.js", ".prettierrc"],
  },
];
