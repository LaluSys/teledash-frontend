import { ReactECharts } from "components/Elements/ECharts/ECharts";
import type { EChartsOption } from "echarts";
import { SentimentTimelinePoint } from "../api";

interface SentimentTimelineChartProps {
  data: SentimentTimelinePoint[];
  loading?: boolean;
}

export function SentimentTimelineChart({
  data,
  loading,
}: SentimentTimelineChartProps) {
  const timestamps = data.map((point) => {
    const date = new Date(point.timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  });

  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: ["Positive", "Neutral", "Negative"],
      bottom: 0,
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
    grid: {
      left: "3%",
      right: "4%",
      bottom: "60px",
      containLabel: true,
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
      boundaryGap: false,
      data: timestamps,
    },
    yAxis: {
      type: "value",
      minInterval: 1,
    },
    series: [
      {
        name: "Positive",
        type: "line",
        stack: "Total",
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: "#10b981",
        },
        emphasis: {
          focus: "series",
        },
        data: data.map((point) => point.positive),
      },
      {
        name: "Neutral",
        type: "line",
        stack: "Total",
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: "#6b7280",
        },
        emphasis: {
          focus: "series",
        },
        data: data.map((point) => point.neutral),
      },
      {
        name: "Negative",
        type: "line",
        stack: "Total",
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: "#ef4444",
        },
        emphasis: {
          focus: "series",
        },
        data: data.map((point) => point.negative),
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      loading={loading}
      style={{ height: "500px" }}
    />
  );
}
