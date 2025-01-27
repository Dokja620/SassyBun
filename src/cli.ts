import { Command } from "commander";
import { initProject } from "./commands/init";
import { compileSass, startWatcher } from "./commands/compiler";
const program = new Command();

program
  .command("init")
  .description("Initialize a new SASS project")
  .action(async () => {
    await initProject();
  });

program
  .command("compile")
  .description("Compile SCSS Files")
  .action(async () => {
    await compileSass();
  });

program
  .command("watch")
  .description("Watch SCSS Files")
  .action(async () => {
    await startWatcher();
  });

program.parse(process.argv);
