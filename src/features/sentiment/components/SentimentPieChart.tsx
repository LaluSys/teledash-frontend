import { ReactECharts } from "components/Elements/ECharts/ECharts";
import type { EChartsOption } from "echarts";
import { SentimentBreakdown } from "../api";

interface SentimentPieChartProps {
  data: SentimentBreakdown;
  loading?: boolean;
}

export function SentimentPieChart({ data, loading }: SentimentPieChartProps) {
  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Sentiment",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: data.positive,
            name: "Positive",
            itemStyle: { color: "#10b981" }, // green
          },
          {
            value: data.neutral,
            name: "Neutral",
            itemStyle: { color: "#6b7280" }, // gray
          },
          {
            value: data.negative,
            name: "Negative",
            itemStyle: { color: "#ef4444" }, // red
          },
        ],
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      loading={loading}
      style={{ height: "400px" }}
    />
  );
}
