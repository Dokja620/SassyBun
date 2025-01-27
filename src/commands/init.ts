import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from "fs";
import { join } from "path";

export function initProject(targetDir: string = "./") {
  const templateDir = join(__dirname, "../../templates");

  if (!existsSync(templateDir)) {
    console.error("❌ Template directory not found!");
    process.exit(1);
  }

  console.log(`🛠️  Initializing project in: ${targetDir}`);

  function copyRecursive(src: string, dest: string, level: number = 0) {
    if (!existsSync(dest)) mkdirSync(dest, { recursive: true });

    const items = readdirSync(src);

    if (level === 1) {
      console.log(`🗃️  Template files created : [ ${items.join("  ")} ]`);
    }

    items.forEach((item) => {
      const srcPath = join(src, item);
      const destPath = join(dest, item);

      if (statSync(srcPath).isDirectory()) {
        copyRecursive(srcPath, destPath, level + 1);
      } else {
        copyFileSync(srcPath, destPath);
      }
    });
  }

  copyRecursive(templateDir, targetDir);

  console.log("🚀 Project initialized successfully!");
}
