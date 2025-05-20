import type { Linter } from "eslint";

export async function disableds(): Promise<Linter.Config[]> {
  return [
    {
      files: ["**/*.d.ts"],
      name: "disables/dts",
      rules: {
        "@typescript-eslint/triple-slash-reference": "off",
      },
    },
    {
      files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
      name: "disables/js",
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
      },
    },
  ];
}
