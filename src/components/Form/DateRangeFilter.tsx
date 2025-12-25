import React from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface DateRangeFilterProps {
  dateFrom: string | undefined;
  dateTo: string | undefined;
  onChange: (dateFrom: string | undefined, dateTo: string | undefined) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateFrom,
  dateTo,
  onChange,
}) => {
  const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (!dates || !dates[0] || !dates[1]) {
      onChange(undefined, undefined);
      return;
    }
    onChange(dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD"));
  };

  const value: [Dayjs, Dayjs] | null =
    dateFrom && dateTo ? [dayjs(dateFrom), dayjs(dateTo)] : null;

  return (
    <RangePicker
      value={value}
      onChange={handleChange}
      format="YYYY-MM-DD"
      style={{ width: "100%" }}
    />
  );
};
