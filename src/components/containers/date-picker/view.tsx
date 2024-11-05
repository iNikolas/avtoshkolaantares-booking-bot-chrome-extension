import React from "react";
import { ImCross } from "react-icons/im";
import ReactDatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { retrieveFullConfig } from "@utils";

import { formatDate } from "./utils";
import { Loader } from "../../ui";
import { Config } from "@entities";

export function DatePicker() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [timestamps, setTimestamps] = React.useState<Set<number> | null>(null);
  const [date, setDate] = React.useState<Date | null>(null);

  const updateStorage = async (newTimestamps: Set<number>) => {
    setIsLoading(true);
    const timestampsArray = Array.from(newTimestamps);
    await chrome.storage.sync.set<Config>({ timestamps: timestampsArray });
    setTimestamps(newTimestamps);
    setIsLoading(false);
  };

  React.useEffect(() => {
    retrieveFullConfig().then((config) => {
      setTimestamps(new Set(config.timestamps));
    });
  }, []);

  if (!timestamps) {
    return <Loader />;
  }

  return (
    <section className="flex flex-col gap-2 max-w-max mx-auto">
      <div className="flex gap-1 flex-wrap justify-center max-w-[327px] mx-auto">
        {Array.from(timestamps).map((timestamp) => (
          <div key={timestamp} className="badge badge-info gap-2">
            <button
              onClick={() => {
                const newSet = new Set(timestamps);
                newSet.delete(timestamp);
                updateStorage(newSet);
              }}
              className="btn btn-xs btn-circle btn-ghost"
              type="button"
            >
              <ImCross />
            </button>
            {formatDate(new Date(timestamp))}
          </div>
        ))}
      </div>
      <ReactDatePicker
        inline
        showTimeSelect
        timeIntervals={60}
        timeFormat="HH:mm"
        minDate={new Date()}
        selected={date}
        onChange={(date) => {
          if (date) {
            setDate(date);
          }
        }}
      />
      <button
        className="btn btn-primary"
        type="button"
        disabled={!date || timestamps.has(date.getTime()) || isLoading}
        onClick={() => {
          if (date) {
            const newSet = new Set([...timestamps, date.getTime()]);
            updateStorage(newSet);
          }
        }}
      >
        {isLoading && <span className="loading loading-spinner"></span>}
        Add
      </button>
    </section>
  );
}
