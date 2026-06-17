import { capitalize } from './utils.js';

interface Player {
  id: string;
  objectName: string;
}

interface GameResult {
  win: Player;
  lose: Player;
  verb: string;
}

interface RPSChoice {
  description: string;
  [key: string]: string;
}

const RPSChoices: Record<string, RPSChoice> = {
  rock: {
    description: 'sedimentary, igneous, or perhaps even metamorphic',
    virus: 'outwaits',
    computer: 'smashes',
    scissors: 'crushes',
  },
  cowboy: {
    description: 'yeehaw~',
    scissors: 'puts away',
    wumpus: 'lassos',
    rock: 'steel-toe kicks',
  },
  scissors: {
    description: 'careful ! sharp ! edges !!',
    paper: 'cuts',
    computer: 'cuts cord of',
    virus: 'cuts DNA of',
  },
  virus: {
    description: 'genetic mutation, malware, or something inbetween',
    cowboy: 'infects',
    computer: 'corrupts',
    wumpus: 'infects',
  },
  computer: {
    description: 'beep boop beep bzrrhggggg',
    cowboy: 'overwhelms',
    paper: 'uninstalls firmware for',
    wumpus: 'deletes assets for',
  },
  wumpus: {
    description: 'the purple Discord fella',
    paper: 'draws picture on',
    rock: 'paints cute face on',
    scissors: 'admires own reflection in',
  },
  paper: {
    description: 'versatile and iconic',
    virus: 'ignores',
    cowboy: 'gives papercut to',
    rock: 'covers',
  },
};

export function getResult(p1: Player, p2: Player): string {
  let gameResult: GameResult;
  if (RPSChoices[p1.objectName] && RPSChoices[p1.objectName][p2.objectName]) {
    gameResult = {
      win: p1,
      lose: p2,
      verb: RPSChoices[p1.objectName][p2.objectName],
    };
  } else if (
    RPSChoices[p2.objectName] &&
    RPSChoices[p2.objectName][p1.objectName]
  ) {
    gameResult = {
      win: p2,
      lose: p1,
      verb: RPSChoices[p2.objectName][p1.objectName],
    };
  } else {
    gameResult = { win: p1, lose: p2, verb: 'tie' };
  }

  return formatResult(gameResult);
}

function formatResult(result: GameResult): string {
  const { win, lose, verb } = result;
  return verb === 'tie'
    ? `<@${win.id}> and <@${lose.id}> draw with **${win.objectName}**`
    : `<@${win.id}>'s **${win.objectName}** ${verb} <@${lose.id}>'s **${lose.objectName}**`;
}

export function getRPSChoices(): string[] {
  return Object.keys(RPSChoices);
}

export interface ShuffledOption {
  label: string;
  value: string;
  description: string;
}

export function getShuffledOptions(): ShuffledOption[] {
  const allChoices = getRPSChoices();
  const options: ShuffledOption[] = [];

  for (const c of allChoices) {
    options.push({
      label: capitalize(c),
      value: c.toLowerCase(),
      description: RPSChoices[c]['description'],
    });
  }

  return options.sort(() => Math.random() - 0.5);
}
