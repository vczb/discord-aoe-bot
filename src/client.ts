import { Client, GatewayIntentBits, Message } from "discord.js";

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

client.on("guildCreate", (guild: any) => {
  console.log(`✅ NEW GUILD DETECTED: ${guild.name} (${guild.id})`);
});

client.on("guildDelete", (guild: any) => {
  console.log(`✅ DELETE GUILD DETECTED: ${guild.name} (${guild.id})`);
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

