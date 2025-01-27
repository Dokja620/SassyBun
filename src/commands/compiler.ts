import { watch } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { compile } from "sass";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import path from "node:path";

const SCSS_DIR = "./scss"; // SCSS source directory
const OUTPUT_DIR = "./dist"; // Compiled output directory
const MAIN_SCSS = "./scss/global.scss"; // Entry SCSS file

// Function to compile SCSS
export async function compileSass() {
  try {
    console.log("🔄 Compiling...");

    // Ensure output directory exists
    await mkdir(OUTPUT_DIR, { recursive: true });

    // Compile SCSS to CSS
    const result = compile(MAIN_SCSS, {
      style: "expanded",
      sourceMap: true,
      loadPaths: [SCSS_DIR], // Allow importing from SCSS directory
    });

    const cssPath = path.join(OUTPUT_DIR, "global.css");

    // Apply PostCSS plugins (autoprefixer)
    const postcssResult = await postcss([autoprefixer]).process(result.css, {
      from: MAIN_SCSS,
      to: cssPath,
      map: { inline: false },
    });

    // Write CSS and source map
    await writeFile(cssPath, postcssResult.css);
    if (postcssResult.map) {
      await writeFile(`${cssPath}.map`, postcssResult.map.toString());
    }

    console.log("✨ Compilation successful");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Watch mode setup
export function startWatcher() {
  console.log("👀 Watching SCSS files...");

  const watcher = watch(
    SCSS_DIR,
    { recursive: true, persistent: true },
    (eventType, filename) => {
      if (!filename) return;

      if (path.extname(filename) === ".scss") {
        console.log(`\n📄 Changed: ${filename}`);
        compileSass();
        console.log("👁️  Still watching...\n");
      }
    }
  );

  // Handle errors
  watcher.on("error", (error) => {
    console.error("Watch error:", error);
  });

  // Initial compilation
  compileSass();

  // Handle process termination
  process.on("SIGINT", () => {
    console.log("\n🛑 Stopping watch mode...");
    watcher.close();
    process.exit(0);
  });
}

// Determine execution mode (watch or compile once)
if (process.argv.includes("--watch")) {
  startWatcher();
} else {
  compileSass();
}
