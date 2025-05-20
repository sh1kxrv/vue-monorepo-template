import type { Config } from 'tailwindcss';

import path from 'node:path';

import { getPackagesSync } from '@manypkg/get-packages';
import plugin from 'tailwindcss/plugin';

const { packages } = getPackagesSync(process.cwd());

const tailwindPackages: string[] = [];

packages.forEach((pkg) => {
  tailwindPackages.push(pkg.dir);
});

const SPACING_RANGE = [1, 128];

const createRemSpacings = (range = SPACING_RANGE) => {
  const [start = 1, end = 128] = range;
  const spacings = {} as Record<string, string>;

  for (let i = start; i <= end; i++) {
    spacings[`${i}`] = `${(i / 10).toFixed(1)}rem`;
  }

  return spacings;
};

export default {
  content: [
    './index.html',
    ...tailwindPackages.map((item) =>
      path.join(item, 'src/**/*.{vue,js,ts,jsx,tsx,svelte,astro,html}'),
    ),
  ],
  theme: {
    extend: {
      lineHeight: createRemSpacings(),
    },
    borderRadius: {
      ...createRemSpacings(),
      full: '9999px',
    },
    spacing: {
      0: '0px',
      ...createRemSpacings(),
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const typographyWithOnlySizes = {} as Record<string, any>;
      for (let i = 8; i <= 120; i += 2) {
        typographyWithOnlySizes[`.text-${i}`] = {
          fontSize: `${(i / 10).toFixed(1)}rem`,
        };
      }

      addUtilities(typographyWithOnlySizes);
    }),
  ],
} as Config;
