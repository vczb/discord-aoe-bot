import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getRandomEmoji, DiscordRequest } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';

interface Player {
  id: string;
  objectName: string;
}

interface InteractionData {
  name?: string;
  custom_id?: string;
  values?: string[];
  options?: { value: string }[];
}

interface InteractionBody {
  type: InteractionType;
  id: string;
  data: InteractionData;
  context?: number;
  member?: { user: { id: string } };
  user?: { id: string };
  token: string;
  message?: { id: string };
}

const app = express();
const PORT = process.env.PORT || 3000;

const activeGames: Record<string, Player> = {};

app.post(
  '/interactions',
  verifyKeyMiddleware(process.env.PUBLIC_KEY!),
  async function (req: express.Request, res: express.Response) {
    const { type, id, data } = req.body as InteractionBody;

    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;

      if (name === 'test') {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: InteractionResponseFlags.IS_COMPONENTS_V2,
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                content: `hello world ${getRandomEmoji()}`,
              },
            ],
          },
        });
      }

      if (name === 'challenge' && id) {
        const body = req.body as InteractionBody;
        const context = body.context;
        const userId =
          context === 0 ? body.member!.user.id : body.user!.id;
        const objectName = body.data.options![0].value;

        activeGames[id] = {
          id: userId,
          objectName,
        };

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: InteractionResponseFlags.IS_COMPONENTS_V2,
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                content: `Rock papers scissors challenge from <@${userId}>`,
              },
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.BUTTON,
                    custom_id: `accept_button_${req.body.id}`,
                    label: 'Accept',
                    style: ButtonStyleTypes.PRIMARY,
                  },
                ],
              },
            ],
          },
        });
      }

      console.error(`unknown command: ${name}`);
      return res.status(400).json({ error: 'unknown command' });
    }

    if (type === InteractionType.MESSAGE_COMPONENT) {
      const componentId = data.custom_id!;

      if (componentId.startsWith('accept_button_')) {
        const gameId = componentId.replace('accept_button_', '');
        const body = req.body as InteractionBody;
        const endpoint = `webhooks/${process.env.APP_ID}/${body.token}/messages/${body.message!.id}`;
        try {
          await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              flags:
                InteractionResponseFlags.EPHEMERAL |
                InteractionResponseFlags.IS_COMPONENTS_V2,
              components: [
                {
                  type: MessageComponentTypes.TEXT_DISPLAY,
                  content: 'What is your object of choice?',
                },
                {
                  type: MessageComponentTypes.ACTION_ROW,
                  components: [
                    {
                      type: MessageComponentTypes.STRING_SELECT,
                      custom_id: `select_choice_${gameId}`,
                      options: getShuffledOptions(),
                    },
                  ],
                },
              ],
            },
          });
          await DiscordRequest(endpoint, { method: 'DELETE' });
        } catch (err) {
          console.error('Error sending message:', err);
        }
      } else if (componentId.startsWith('select_choice_')) {
        const gameId = componentId.replace('select_choice_', '');

        if (activeGames[gameId]) {
          const body = req.body as InteractionBody;
          const context = body.context;
          const userId =
            context === 0 ? body.member!.user.id : body.user!.id;
          const objectName = data.values![0];
          const resultStr = getResult(activeGames[gameId], {
            id: userId,
            objectName,
          });

          delete activeGames[gameId];
          const endpoint = `webhooks/${process.env.APP_ID}/${body.token}/messages/${body.message!.id}`;

          try {
            await res.send({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                flags: InteractionResponseFlags.IS_COMPONENTS_V2,
                components: [
                  {
                    type: MessageComponentTypes.TEXT_DISPLAY,
                    content: resultStr,
                  },
                ],
              },
            });
            await DiscordRequest(endpoint, {
              method: 'PATCH',
              body: {
                components: [
                  {
                    type: MessageComponentTypes.TEXT_DISPLAY,
                    content: 'Nice choice ' + getRandomEmoji(),
                  },
                ],
              },
            });
          } catch (err) {
            console.error('Error sending message:', err);
          }
        }
      }

      return;
    }

    console.error('unknown interaction type', type);
    return res.status(400).json({ error: 'unknown interaction type' });
  },
);

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
