import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 600 });

export function get<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

export function set<T>(key: string, data: T): void {
  cache.set(key, data);
}
