import { promises as fs } from "node:fs";
import { join, normalize } from "node:path";

const rootDir = process.cwd();

async function cleanTargetsRecursively(currentDir, targets) {
  const items = await fs.readdir(currentDir);

  for (const item of items) {
    try {
      const itemPath = normalize(join(currentDir, item));
      const stat = await fs.lstat(itemPath);

      if (targets.includes(item)) {
        await fs.rm(itemPath, { force: true, recursive: true });
        console.log(`Deleted: ${itemPath}`);
      } else if (stat.isDirectory()) {
        await cleanTargetsRecursively(itemPath, targets);
      }
    } catch (error) {
      console.error(
        `Error handling item ${item} in ${currentDir}: ${error.message}`
      );
    }
  }
}

(async function startCleanup() {
  const targets = ["node_modules", "dist", ".turbo", "dist.zip"];
  const deleteLockFile = process.argv.includes("--del-lock");
  const cleanupTargets = [...targets];

  if (deleteLockFile) {
    cleanupTargets.push("pnpm-lock.yaml");
  }

  console.log(
    `Starting cleanup of targets: ${cleanupTargets.join(
      ", "
    )} from root: ${rootDir}`
  );

  try {
    await cleanTargetsRecursively(rootDir, cleanupTargets);
    console.log("Cleanup process completed successfully.");
  } catch (error) {
    console.error(`Unexpected error during cleanup: ${error.message}`);
    process.exit(1);
  }
})();
