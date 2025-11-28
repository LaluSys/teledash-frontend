import { formatDate, parseDate } from "lib/date";

interface DateSeparatorProps {
  date?: string | null;
}

export const DateSeparator = ({ date }: DateSeparatorProps) => {
  if (!date) return null;

  return (
    <li className="flex justify-center py-1">
      <div className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-400">
        {formatDate(parseDate(date), "EEEE, d. MMMM yyyy")}
      </div>
    </li>
  );
};
