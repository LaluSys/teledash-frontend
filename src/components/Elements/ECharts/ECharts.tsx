import { init, getInstanceByDom } from "echarts";
import type { EChartsOption, ECharts, SetOptionOpts } from "echarts";
import { useRef, useEffect } from "react";
import type { CSSProperties } from "react";

import { parseDate } from "lib/date";

import { ChatMetrics } from "types";

// source: https://dev.to/maneetgoyal/using-apache-echarts-with-react-and-typescript-353k

export interface ReactEChartsProps {
  option: EChartsOption;
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark";
}

export function ReactECharts({
  option,
  style,
  settings,
  loading,
  theme,
}: ReactEChartsProps): JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current, theme);
    }

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      chart?.setOption(option, settings);
    }
  }, [option, settings, theme]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      loading === true ? chart?.showLoading() : chart?.hideLoading();
    }
  }, [loading, theme]);

  return (
    <div
      ref={chartRef}
      className="flex"
      style={{ width: "100%", height: "100%", ...style }}
    />
  );
}

export const ActivityChart = ({
  metric,
}: {
  metric: ChatMetrics["activity_total"];
}) => {
  if (!metric || !metric.start_date || !metric.data || !metric.time_delta)
    return null;

  let base = +parseDate(metric.start_date);
  const timeInterval = metric.time_delta * 1000;
  const date = [];

  for (let i = 0; i < metric.data.length; i++) {
    const now = new Date(base);
    const time = now.getHours().toString().padStart(2, "0") + ":00";
    date.push(
      [now.getDate(), now.getMonth() + 1, now.getFullYear()].join(".") +
        " " +
        time,
    );

    base += timeInterval; // Increment base for the next date
  }

  const option: ReactEChartsProps["option"] | undefined = {
    tooltip: {
      trigger: "axis",
      formatter: "{c} messages on {b}",
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    grid: {
      left: 30,
      top: 30,
      right: 10,
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    xAxis: {
      type: "category",
      data: date,
    },
    yAxis: {
      type: "value",
      minInterval: 1,
    },
    series: [
      {
        name: "Activity",
        type: "line",
        data: metric.data,
        smooth: true,
        connectNulls: true,
        zlevel: 1,
      },
    ],
  };

  return <ReactECharts option={option} />;
};

export const GrowthChart = ({
  metric,
}: {
  metric: ChatMetrics["growth_total"];
}) => {
  if (!metric || !metric.start_date || !metric.data || !metric.time_delta)
    return null;

  let base = +parseDate(metric.start_date);
  const timeInterval = metric.time_delta * 1000;
  const date = [];

  for (let i = 0; i < metric.data.length; i++) {
    const now = new Date(base);
    const time = now.getHours().toString().padStart(2, "0") + ":00";
    date.push(
      [now.getDate(), now.getMonth() + 1, now.getFullYear()].join(".") +
        " " +
        time,
    );

    base += timeInterval; // Increment base for the next date
  }

  const option: ReactEChartsProps["option"] | undefined = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        return params[0].value
          ? `${params[0].value} users on ${params[0].name}`
          : "";
      },
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    grid: {
      left: 55,
      top: 30,
      right: 10,
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    xAxis: {
      type: "category",
      data: date,
    },
    yAxis: {
      type: "value",
      minInterval: 1,
    },
    series: [
      {
        name: "Member Growth",
        type: "line",
        data: metric.data,
        smooth: true,
        connectNulls: true,
        zlevel: 1,
      },
    ],
  };

  return <ReactECharts option={option} />;
};
