import "dotenv/config";
import { InstallGlobalCommands } from "./utils.js";

interface Command {
  name: string;
  description: string;
  options?: {
    type: number;
    name: string;
    description: string;
    required: boolean;
  }[];
  type: number;
  integration_types: number[];
  contexts: number[];
}

const PLAYER_COMMAND: Command = {
  name: "player",
  description: "Look up an Age of Empires II player",
  options: [
    {
      type: 3,
      name: "username",
      description: "The player username to look up",
      required: true,
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const LASTMATCH_COMMAND: Command = {
  name: "lastmatch",
  description: "Display the latest played match for a player",
  options: [
    {
      type: 3,
      name: "player",
      description: "The player username to look up",
      required: true,
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

InstallGlobalCommands(process.env.APP_ID!, [PLAYER_COMMAND, LASTMATCH_COMMAND]);
