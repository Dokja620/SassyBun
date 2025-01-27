import { Command } from "commander";
import initProject from "./commands/init";
import compileSass from "./commands/compile";
import watchSass from "./commands/watch";

const program = new Command();

program
  .command("init")
  .description("Initialize a new SASS project")
  .action(initProject);

program
  .command("compile")
  .description("Compile SCSS files")
  .action(initProject);

program
  .command("watch")
  .description("Watch SCSS files for changes")
  .action(initProject);

program.parse(process.agrv);
