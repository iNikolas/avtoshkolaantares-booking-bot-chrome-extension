import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Config } from "@entities";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
