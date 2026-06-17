import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

interface CommandChoice {
  name: string;
  value: string;
}

function createCommandChoices(): CommandChoice[] {
  const choices = getRPSChoices();
  const commandChoices: CommandChoice[] = [];

  for (const choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

interface CommandOption {
  type: number;
  name: string;
  description: string;
  required: boolean;
  choices: CommandChoice[];
}

interface Command {
  name: string;
  description: string;
  options?: CommandOption[];
  type: number;
  integration_types: number[];
  contexts: number[];
}

const TEST_COMMAND: Command = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const CHALLENGE_COMMAND: Command = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const ALL_COMMANDS: Command[] = [TEST_COMMAND, CHALLENGE_COMMAND];

InstallGlobalCommands(process.env.APP_ID!, ALL_COMMANDS);
