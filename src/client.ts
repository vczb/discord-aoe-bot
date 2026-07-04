import { Client, GatewayIntentBits, Message } from "discord.js";
import { guildController } from "./controllers/guilds.js";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Bot successfully logged in! Ready to receive events.`);
});

client.on("guildCreate", async (guild: any) => {
  await guildController.onGuildCreate(guild);
});

client.on("guildDelete", async (guild: any) => {
  await guildController.onGuildDelete(guild.id);
});

client.on("guildMemberAdd", (member: any) => {
  console.log(
    `✅ NEW MEMBER DETECTED: ${member.user.tag} joined ${member.guild.name}`,
  );
});

client.on("messageCreate", async (message: Message) => {
  if (message.content.toLowerCase() === "!ping") {
    message.reply("Pong!");
  }
});
