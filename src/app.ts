import "dotenv/config";
import express from "express";
import { verifyKeyMiddleware } from "discord-interactions";
import { handleInteraction } from "./controllers/interaction.js";
import { handleGetGuild } from "./controllers/guild.js";
import { localhostOnly } from "./middleware/localhostOnly.js";
import { handleWebhookCommand } from "./controllers/webhook.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY!),
  handleInteraction,
);

app.get("/guild/:guildId", localhostOnly, handleGetGuild);

app.post(
  "/webhooks",
  verifyKeyMiddleware(process.env.PUBLIC_KEY!),
  handleWebhookCommand,
);

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
