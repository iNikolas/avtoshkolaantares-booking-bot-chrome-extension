import { Config } from "../types";

function initializeConfig(config: Partial<Config>): Config {
  return {
    isRunning: config.isRunning ?? false,
  };
}

export async function retrieveFullConfig(): Promise<Config> {
  const config = await chrome.storage.sync.get<Partial<Config>>(null);

  return initializeConfig(config);
}

export async function updateConfig(config: Partial<Config>) {
  await chrome.storage.sync.set(config);
}
