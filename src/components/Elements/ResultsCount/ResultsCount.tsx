import { formatNumber } from "utils/formatNumber";

export type ResultsCountProps = {
  count: number;
};

export const ResultsCount = ({ count }: ResultsCountProps) => {
  return (
    <div className="ml-2 whitespace-nowrap text-xs font-medium text-gray-900">
      <span className="text-sm font-semibold">{formatNumber(count)}</span>{" "}
      result
      {count !== 1 && "s"}
    </div>
  );
};
