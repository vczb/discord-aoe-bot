import "dotenv/config";
import express from "express";
import { verifyKeyMiddleware } from "discord-interactions";
import { handleInteraction } from "./controllers/interaction.js";
import { handleWebhookCommand } from "./controllers/webhook.js";
import { client } from "./client.js";
import { log, logError } from "./utils.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY!),
  handleInteraction,
);

app.post(
  "/webhooks",
  verifyKeyMiddleware(process.env.PUBLIC_KEY!),
  handleWebhookCommand,
);

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => {
    log("Bot logged in successfully.");
  })
  .catch((err) => {
    logError("Failed to log in bot:", err);
  });

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
