import { BookingForm } from "@screens";

function App() {
  // React.useEffect(() => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     const tab = tabs[0];

  //     if (!tab.id) {
  //       return;
  //     }

  //     chrome.scripting.executeScript({
  //       target: { tabId: tab.id },
  //       func: () => {
  //         console.log("Working!");
  //       },
  //     });
  //   });
  // }, []);

  return (
    <main className="prose min-w-max p-4">
      <h1 className="text-center">Antares Booking Bot</h1>

      <BookingForm />
    </main>
  );
}

export default App;
