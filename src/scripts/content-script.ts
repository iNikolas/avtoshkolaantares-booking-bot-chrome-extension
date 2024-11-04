"use script";

import { retrieveFullConfig } from "@utils";
// import { waitForMs } from "@config";

chrome.storage.onChanged.addListener(onConfigChanged);

async function onConfigChanged() {
  const config = await retrieveFullConfig();

  const { isRunning } = config;

  if (isRunning) {
    const days = retrieveCalendarDays();

    for (const day of days) {
      click(day);

      try {
        // const result = await checkForBooking(day.innerText);
      } catch (e) {
        console.log(e);
      }
    }
  }
}

function retrieveCalendarDays(): HTMLTableCellElement[] {
  return Array.from(
    document.querySelectorAll<HTMLTableCellElement>("td.next-month"),
  );
}

function click(element: HTMLElement) {
  const clickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  element.dispatchEvent(clickEvent);
}

// async function checkForBooking(day: string): Promise<HTMLTableElement> {
//   return new Promise((resolve, reject) => {
//     const startTime = performance.now();

//     function searchForElement() {
//       const element = document.querySelector<HTMLTableElement>(".lesson-table");

//       const textLabel =
//         document.getElementById("MainContent_Label6")?.innerText;

//       const isCurrentDay = !!textLabel?.includes(
//         ` ${day.length === 1 ? `0${day}` : day}.`,
//       );

//       if (isCurrentDay && textLabel?.includes("На жаль")) {
//         reject(null);
//       }

//       if (element && isCurrentDay) {
//         resolve(element);
//       }

//       if (performance.now() - startTime >= waitForMs) {
//         reject(null);
//       }

//       if (document.visibilityState === "visible") {
//         return requestAnimationFrame(searchForElement);
//       }

//       setTimeout(searchForElement);
//     }

//     searchForElement();
//   });
// }

onConfigChanged();
