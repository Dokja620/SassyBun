import { watch } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import sass from "sass";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import path from "node:path";

type CompilerOptions = {
  scssDir: string;
  outputDir: string;
  mainFile: string;
  style?: "expanded" | "compressed";
  sourceMap: boolean;
};

export class SassCompiler {
  private options: CompilerOptions;

  constructor(options: CompilerOptions) {
    this.options = {
      style: "expanded",
      ...options,
    };
  }

  async compile(): Promise<void> {
    try {
      console.log("🔄 Compiling...");

      await mkdir(this.options.outputDir, { recursive: true });

      const result = sass.compile(this.options.mainFile, {
        style: this.options.style,
        sourceMap: this.options.sourceMap,
        loadPaths: [this.options.scssDir],
      });

      const cssPath = path.join(
        this.options.outputDir,
        path.basename(this.options.mainFile, ".scss") + ".css"
      );
      const processor = postcss([autoprefixer]);

      const postcssResult = await processor.process(result.css, {
        from: this.options.mainFile,
        to: cssPath,
        map: this.options.sourceMap ? { inline: false } : false,
      });

      await writeFile(cssPath, postcssResult.css);

      if (postcssResult.map && this.options.sourceMap) {
        await writeFile(`${cssPath}.map`, postcssResult.map.toString());
      }

      console.log("✨ Compilation successful");
    } catch (error) {
      console.error(
        "❌ Error:",
        error instanceof Error ? error.message : error
      );
      process.exit(1);
    }
  }

  watch(): void {
    console.log("👀 Watching SCSS files...");

    const watcher = watch(
      this.options.scssDir,
      {
        recursive: true,
        persistent: true,
      },
      (eventType, filename) => {
        if (!filename) return;

        if (path.extname(filename) === ".scss") {
          console.log(`\n📄 Changed: ${filename}`);
          this.compile();
          console.log("👁️  Still watching...\n");
        }
      }
    );

    watcher.on("error", (error) => {
      console.error("Watch error:", error);
    });

    process.on("SIGINT", () => {
      console.log("\n🛑 Stopping watch mode...");
      watcher.close();
      process.exit(0);
    });

    this.compile();
  }
}
