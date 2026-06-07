//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";
import importX from "eslint-plugin-import-x";

export default [
  ...tanstackConfig,
  {
    plugins: {
      "import-x": importX,
    },
    rules: {
      "import/no-cycle": "off",
      "import/order": "off",
      "sort-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "pnpm/json-enforce-catalog": "off",
      "import-x/consistent-type-specifier-style": "off",
      "import/consistent-type-specifier-style": "off",
    },
  },
  {
    ignores: ["eslint.config.js", ".prettierrc"],
  },
];
