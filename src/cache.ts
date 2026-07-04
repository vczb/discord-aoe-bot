import NodeCache from "node-cache";
import { log } from "./utils.js";

const cache = new NodeCache({ stdTTL: 600 });

export function get<T>(key: string): T | undefined {
  log("[cache]", "Getting", key);
  return cache.get<T>(key);
}

export function set<T>(key: string, data: T): void {
  log("[cache]", "Setting", key);
  cache.set(key, data);
}
