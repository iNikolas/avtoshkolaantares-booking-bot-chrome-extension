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
): Promise<HTMLAnchorElement[]> {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();

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
          .map((row) => row.querySelector<HTMLAnchorElement>("a"))
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

export async function confirmBooking() {
  const submitButton = document.getElementById(bookButtonId);
  const cancelButton = document.getElementById(cancelButtonId);
  const bookingPanelDateTag = document.getElementById(bookingPanelDateTagId);
  const bookingPanelTimeTag = document.getElementById(bookingPanelTimeTagId);

  console.log(submitButton);

  if (!submitButton || !bookingPanelDateTag || !bookingPanelTimeTag) {
    return;
  }

  if (cancelButton) {
    click(cancelButton);
  }

  await waitMs();
}
