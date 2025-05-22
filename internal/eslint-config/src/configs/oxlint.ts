import type { Linter } from 'eslint';

import { interopDefault } from '../util';

export async function oxlint(): Promise<Linter.Config[]> {
  const [pluginOxlint] = await Promise.all([
    interopDefault(import('eslint-plugin-oxlint')),
  ] as const);

  return [
    {
      plugins: {
        oxlint: pluginOxlint,
      },
      ...pluginOxlint.configs['flat/recommended'],
    },
  ];
}
