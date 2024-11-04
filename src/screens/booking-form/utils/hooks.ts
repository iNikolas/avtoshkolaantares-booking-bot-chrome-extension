import React from "react";

import { Config } from "@entities";
import { retrieveFullConfig } from "@utils";

import { allowedDomain } from "../config";

export function useConfig() {
  const [config, setConfig] = React.useState<Config | null>(null);

  React.useEffect(() => {
    const onConfigChanged = () => {
      retrieveFullConfig().then(setConfig);
    };

    chrome.storage.onChanged.addListener(onConfigChanged);

    onConfigChanged();

    return () => {
      chrome.storage.onChanged.removeListener(onConfigChanged);
    };
  }, []);

  return config;
}

export function useIsAllowedDomainCheck() {
  const [isAllowedDomain, setIsAllowedDomain] = React.useState<boolean | null>(
    null,
  );

  React.useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];

      if (currentTab?.url?.includes(allowedDomain)) {
        setIsAllowedDomain(true);
      } else {
        setIsAllowedDomain(false);
      }
    });
  }, []);

  return isAllowedDomain;
}
