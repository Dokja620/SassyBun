#!/usr/bin/env node

import { SassCompiler } from "./compiler";
import path from "path";

const args = process.argv.slice(2);
const isWatchMode = args.includes("--watch");

const compiler = new SassCompiler({
  scssDir: path.join(process.cwd(), "scss"),
  outputDir: path.join(process.cwd(), "src"),
  mainFile: path.join(process.cwd(), "scss/global.scss"),
  sourceMap: true,
});

if (isWatchMode) {
  compiler.watch();
} else {
  compiler.compile();
}
