import fs from "fs/promises";
import path from "path";

export async function initProject() {
  const templateDir = path.join(import.meta.dir, "../../templates");
  const targetDir = process.cwd();

  try {
    console.log("Initializing project... Creating files and directories");

    await copyDirectory(templateDir, targetDir);

    console.log("Project initialized successfully!");
  } catch (error) {
    console.error("Failed to initialize project", error);
  }
}

async function copyDirectory(src: string, dest: string) {
  try {
    await fs.mkdir(dest, { recursive: true });

    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error("Error copying files :", error);
  }
}
