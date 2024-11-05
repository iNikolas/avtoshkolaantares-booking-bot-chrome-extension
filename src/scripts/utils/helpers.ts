import {
  bookButtonId,
  bookingPanelDateTagId,
  bookingPanelTimeTagId,
  bookingTableClassName,
  calentarDaySelector,
  cancelButtonId,
  noBookingText,
  textLabelId,
  waitForMs,
} from "@config";
import { Config } from "@entities";
import { waitMs } from "@utils";

export async function checkForBooking(
  day: string,
  timestamps: Config["timestamps"],
): Promise<HTMLAnchorElement[]> {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const desiredHours = new Set(
      timestamps.reduce<string[]>((acc, val) => {
        const date = new Date(val);
        const isCurrentDay = date.getDate().toString() === day;

        if (isCurrentDay) {
          return [...acc, date.getHours().toString()];
        }

        return acc;
      }, []),
    );

    function searchForElement() {
      const bookingTable = document.querySelector<HTMLTableElement>(
        `.${bookingTableClassName}`,
      );

      const textLabel = document.getElementById(textLabelId)?.innerText;

      const isCurrentDay = !!textLabel?.includes(
        ` ${day.length === 1 ? `0${day}` : day}.`,
      );

      if (isCurrentDay && textLabel?.includes(noBookingText)) {
        reject(null);
      }

      if (bookingTable && isCurrentDay) {
        const anchors = Array.from(
          bookingTable.querySelectorAll<HTMLTableRowElement>("tr"),
        )
          .map((row) => {
            const hours = parseInt(
              row.querySelector<HTMLTableCellElement>("th")?.innerText ??
                "".split(":")[0],
            ).toString();
            const isMatchingTime = desiredHours.has(hours);

            if (!isMatchingTime) {
              return null;
            }

            return row.querySelector<HTMLAnchorElement>("a");
          })
          .filter((row) => !!row);

        resolve(anchors);
      }

      if (performance.now() - startTime >= waitForMs) {
        reject(null);
      }

      setTimeout(searchForElement);
    }

    searchForElement();
  });
}

export function retrieveCalendarDays(
  timestamps: Config["timestamps"],
): HTMLTableCellElement[] {
  const desiredDaysSet = timestamps.reduce<Set<string>>((acc, val) => {
    const date = new Date(val);
    acc.add(date.getDate().toString());

    return acc;
  }, new Set());

  console.log(desiredDaysSet.values());

  return Array.from(
    document.querySelectorAll<HTMLTableCellElement>(calentarDaySelector),
  ).filter((cell) => desiredDaysSet.has(cell.innerText));
}

export function click(element: HTMLElement) {
  const clickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  element.dispatchEvent(clickEvent);
}

export async function confirmBooking(timestamps: Config["timestamps"]) {
  const submitButton = document.getElementById(bookButtonId);
  const cancelButton = document.getElementById(cancelButtonId);
  const bookingPanelDateTag = document.getElementById(bookingPanelDateTagId);
  const bookingPanelTimeTag = document.getElementById(bookingPanelTimeTagId);

  if (!submitButton || !bookingPanelDateTag || !bookingPanelTimeTag) {
    return;
  }

  if (submitButton) {
    const selectedDay = parseInt(
      bookingPanelDateTag.innerText.split(".")[0],
    ).toString();
    const selectedHours = parseInt(
      bookingPanelTimeTag.innerText.split(":")[0],
    ).toString();

    const isAllowed = timestamps.some((val) => {
      const date = new Date(val);
      return (
        date.getDate().toString() === selectedDay &&
        date.getHours().toString() === selectedHours
      );
    });

    if (isAllowed) {
      click(submitButton);
    }

    if (!isAllowed && cancelButton) {
      click(cancelButton);
    }

    await waitMs();
  }
}
