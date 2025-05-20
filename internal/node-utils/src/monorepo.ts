import { dirname } from "node:path";

import { getPackages, getPackagesSync } from "@manypkg/get-packages";

import { findUpSync } from "find-up";

/**
 * Поиск корня монорепозитория
 */
export function findMonorepoRoot(cwd: string = process.cwd()) {
  const lockFile = findUpSync("pnpm-lock.yaml", {
    cwd,
    type: "file",
  });
  return dirname(lockFile || "");
}

/**
 * Получение списка пакетов в монорепозитории
 */
export function getMonorepoPackagesSync() {
  const root = findMonorepoRoot();
  return getPackagesSync(root);
}

/**
 * Асинхронное получение списка пакетов в монорепозитории
 */
export async function getMonorepoPackages() {
  const root = findMonorepoRoot();
  return await getPackages(root);
}

/**
 * Получение пакета по имени
 * @param pkgName Имя пакета
 */
export async function getMonorepoPackage(pkgName: string) {
  const { packages } = await getMonorepoPackages();
  return packages.find((pkg) => pkg.packageJson.name === pkgName);
}
