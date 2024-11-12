import { retrieveFullConfig, waitMs } from "@utils";

import {
  checkForBooking,
  click,
  confirmBooking,
  retrieveCalendarDays,
} from "./utils";

async function main() {
  while (true) {
    const config = await retrieveFullConfig();

    const days = retrieveCalendarDays(config.timestamps);

    if (!config.isRunning) {
      await waitMs(3000);
      break;
    }

    for (const day of days) {
      if (!config.isRunning) {
        break;
      }

      click(day);

      try {
        const bookings = await checkForBooking(
          day.innerText,
          config.timestamps,
        );

        if (bookings.length) {
          click(bookings[0]);

          await waitMs();
          break;
        }
      } catch (e) {
        void e;
      }
    }

    await confirmBooking(config.timestamps);
  }

  setTimeout(main);
}

main();
