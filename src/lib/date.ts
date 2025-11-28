import { formatDistanceToNow, format, parseISO } from "date-fns";
import { enGB } from "date-fns/locale";

// append ZULU because ISOString is UTC time
// see: https://codeofmatt.com/javascript-date-parsing-changes-in-es6/
export const parseDate = (ISOString: string) => parseISO(ISOString + "Z");

export const formatDate = (parsedDate: Date, formatStr?: string) =>
  format(parsedDate, formatStr ?? "dd.MM.yyyy HH:mm", { locale: enGB });

export const formatDateDistance = (parsedDate: Date) =>
  formatDistanceToNow(parsedDate, {
    addSuffix: true,
    includeSeconds: true,
  });
