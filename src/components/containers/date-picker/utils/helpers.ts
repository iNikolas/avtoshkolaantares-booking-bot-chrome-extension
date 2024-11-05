import { format } from "date-fns";

export function formatDate(date: Date, formatter = "dd.MM HH:mm") {
  return format(date, formatter);
}
