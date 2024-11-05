import { DatePicker, Loader } from "@components";
import { updateConfig } from "@utils";

import { useConfig, useIsAllowedDomainCheck } from "./utils";
import { allowedDomain } from "./config";

export function BookingForm() {
  const config = useConfig();

  const isAllowedDomain = useIsAllowedDomainCheck();

  const handleStart = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateConfig({ isRunning: true });
  };

  if (!config || isAllowedDomain == null) {
    return <Loader />;
  }

  if (!isAllowedDomain) {
    return (
      <p className="text-error w-3/4 text-center mx-auto">
        Works only for <b>{allowedDomain}</b> website
      </p>
    );
  }

  return (
    <div>
      <form onSubmit={handleStart}>
        <DatePicker />
        <button
          className="btn btn-primary"
          disabled={config.isRunning || !isAllowedDomain}
          type="submit"
        >
          Start Bot
        </button>
      </form>

      {config.isRunning && (
        <button
          onClick={() => updateConfig({ isRunning: false })}
          type="button"
          className="btn btn-ghost"
        >
          Stop bot
        </button>
      )}
    </div>
  );
}
