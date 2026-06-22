import type { Request, Response } from "express";
import { getGuild } from "../api/discord.js";

export async function handleGetGuild(req: Request, res: Response) {
  try {
    const guild = await getGuild(req.params.guildId);
    res.json(guild);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
