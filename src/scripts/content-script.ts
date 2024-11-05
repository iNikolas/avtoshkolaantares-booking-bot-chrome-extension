import { retrieveFullConfig, waitMs } from "@utils";

import {
  checkForBooking,
  click,
  confirmBooking,
  retrieveCalendarDays,
} from "./utils";

async function main() {
  while (true) {
    let config = await retrieveFullConfig();

    const updateConfig = async () => (config = await retrieveFullConfig());

    chrome.storage.onChanged.addListener(updateConfig);

    const days = retrieveCalendarDays(config.timestamps);

    if (!config.isRunning) {
      break;
    }

    for (const day of days) {
      if (!config.isRunning) {
        break;
      }

      click(day);

      try {
        const bookings = await checkForBooking(day.innerText);

        if (bookings.length) {
          click(bookings[0]);

          await waitMs();
          break;
        }
      } catch (e) {
        console.log(e);
      }
    }

    await confirmBooking();

    chrome.storage.onChanged.removeListener(updateConfig);
  }

  setTimeout(main);
}

main();
