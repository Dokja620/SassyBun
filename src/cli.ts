import { Command } from "commander";
import initProject from "./commands/init";
import watchSass from "./commands/watch";
import compileSass from "./commands/compile";

const program = new Command();

program
  .command("init")
  .description("Initialize a new SASS project")
  .action(initProject);

program
  .command("compile")
  .description("Compile SCSS files")
  .action(compileSass);

program
  .command("watch")
  .description("Watch SCSS files for changes")
  .action(watchSass);

program.parse(process.argv);
