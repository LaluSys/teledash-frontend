import { ReactECharts } from "components/Elements/ECharts/ECharts";
import type { EChartsOption } from "echarts";
import { SentimentByChatItem } from "../api";

interface SentimentByChatChartProps {
  data: SentimentByChatItem[];
  loading?: boolean;
}

export function SentimentByChatChart({
  data,
  loading,
}: SentimentByChatChartProps) {
  // Sort by total messages descending and take top 20
  const sortedData = [...data]
    .sort((a, b) => b.total_messages - a.total_messages)
    .slice(0, 20);

  const chatNames = sortedData.map((item) =>
    item.chat_name || `Chat ${item.chat_id.slice(0, 8)}...`
  );
  const positiveData = sortedData.map((item) => item.sentiment_breakdown.positive);
  const neutralData = sortedData.map((item) => item.sentiment_breakdown.neutral);
  const negativeData = sortedData.map((item) => item.sentiment_breakdown.negative);

  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["Positive", "Neutral", "Negative"],
      bottom: 0,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "60px",
      containLabel: true,
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      data: chatNames,
      inverse: true,
    },
    series: [
      {
        name: "Positive",
        type: "bar",
        stack: "total",
        label: {
          show: false,
        },
        emphasis: {
          focus: "series",
        },
        itemStyle: {
          color: "#10b981",
        },
        data: positiveData,
      },
      {
        name: "Neutral",
        type: "bar",
        stack: "total",
        label: {
          show: false,
        },
        emphasis: {
          focus: "series",
        },
        itemStyle: {
          color: "#6b7280",
        },
        data: neutralData,
      },
      {
        name: "Negative",
        type: "bar",
        stack: "total",
        label: {
          show: false,
        },
        emphasis: {
          focus: "series",
        },
        itemStyle: {
          color: "#ef4444",
        },
        data: negativeData,
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      loading={loading}
      style={{ height: `${Math.max(400, sortedData.length * 30)}px` }}
    />
  );
}
