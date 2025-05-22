import { type Plugin } from 'vite';
import { findMonorepoRoot, getMonorepoPackagesSync } from '@mono/node-utils';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

export function useIsolatedAlias() {
  const rootWorkspace = findMonorepoRoot(process.cwd());
  const monorepoPackages = getMonorepoPackagesSync();
  const { packages } = monorepoPackages;
  const toIsolate = Object.fromEntries(
    packages
      .filter((pkg) => pkg.relativeDir.startsWith('pkgs'))
      .map((x) => [
        x.relativeDir.replaceAll('\\', '/'),
        x.dir.replaceAll('\\', '/'),
      ]),
  );

  const checkExists = (path: string) => {
    return existsSync(path);
  };

  const normalizeIsolatedPath = (
    path: string,
    ext: '.js' | '.ts' | null = '.ts',
  ) => {
    if (ext === null) {
      throw new Error(`Cannot be normalized path: ${path}`);
    }

    if (path.includes('.')) return path;

    const indexedPath = join(path, 'index' + ext);
    if (checkExists(indexedPath)) return indexedPath;

    const extensionedPath = path + ext;
    if (checkExists(extensionedPath)) return extensionedPath;

    return normalizeIsolatedPath(path, ext === '.ts' ? '.js' : null);
  };

  return {
    name: 'shikaru-isolated-alias',
    async resolveId(id, importer, resolveOptions) {
      if (
        !importer ||
        importer.includes('node_modules') ||
        id.includes('virtual:')
      )
        return null;

      id = id.replaceAll('\\', '/');
      const rootIsolated = importer.substring(rootWorkspace.length + 1);
      const [workspace, pkg] = rootIsolated.split('/');
      const isolatedKey = [workspace, '/', pkg].join('');
      const isIsolatedAlias = isolatedKey in toIsolate;

      if (id.startsWith('#') && isIsolatedAlias) {
        const justId = id.substring(1);
        const absolutePath = toIsolate[isolatedKey]!;
        const absoluteId = join(absolutePath, 'src', justId);

        const normalizedId = normalizeIsolatedPath(absoluteId);

        const resolved = await this.resolve(
          normalizedId,
          importer,
          Object.assign({ skipSelf: true }, resolveOptions),
        );

        if (resolved) return resolved;
        return {
          id: normalizedId,
        };
      }
      return null;
    },
  } as Plugin;
}
