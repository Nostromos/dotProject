#!/usr/bin/env node
import type { Command, CommandsMap, CLIOptions, CLICommand } from "../types/types.js";

const args = process.argv.slice(2) // get rid of node and script path

const COMMANDS: CommandsMap = {
  generate: {
    description: "Generate an INFO.json file",
    usage: "dotp generate <path_to_project> [options]",
    options: {
      "--verbose": "Enable verbose mode",
      "--force": "Overwrite existing file(s)",
    },
  },
  help: {
    description: "Show help information",
    usage: "dotp help [command?]", // command is optional
  }
};

if (args.length === 0) {
  console.log("Error: No command provided. Use 'dotp help' for usage.");
  process.exit(1);
};

const command: CLICommand = args[0] ?? "";
const commandArgs: string[] = args.slice(1);

const options: CLIOptions = {
  verbose: commandArgs.includes("--verbose"),
  force: commandArgs.includes("--force"),
};

switch (command) {
  case "generate":
    if (commandArgs.length === 0) {
      if (!COMMANDS.generate) {
        console.log("Error: 'generate' command is not defined.");
        process.exit(1);
      }
      console.log("Error: missing file path. Usage: " + COMMANDS.generate.usage);
      process.exit(1);
    }

    const filePath = commandArgs[0];

    console.log(`Generating INFO.json for ${filePath}...`);
    if (options.verbose) console.log("Verbose mode: Enabled");
    if (options.force) console.log("Forcing overwrite");
    // TODO: Add function to generate file
    break;

  case "help":
    if (commandArgs.length > 0 && commandArgs[0] && COMMANDS[commandArgs[0]]) {
      const cmd = commandArgs[0];

      if (COMMANDS[cmd]) {
        console.log(`Usage: ${COMMANDS[cmd].usage}`);
        if (COMMANDS[cmd].options) {
          console.log("Options:");
          Object.entries(COMMANDS[cmd].options!).forEach(([flag, desc]) => {
            console.log(`  ${flag} - ${desc}`);
          });
        }
      } else {
        console.log("Error: command 'help' not defined");
      }
    } else {
      console.log("Available Commands:");
      Object.entries(COMMANDS).forEach(([cmd, details]) => {
        const commandDetails = details as Command;
        console.log(`  ${cmd} - ${commandDetails.description}`)
      });
    }
    break;

  default:
    console.error(`Error: Unknown command '${command}'. Use 'dotp help' for usage.`);
    process.exit(1);
}