import { ReactECharts } from "components/Elements";
import type { EChartsOption } from "echarts";
import { Ngram } from "../api";

interface NgramWordCloudProps {
  ngrams: Ngram[];
}

export function NgramWordCloud({ ngrams }: NgramWordCloudProps) {
  if (!ngrams || ngrams.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <p className="text-gray-500">No n-grams available</p>
      </div>
    );
  }

  // Prepare data for word cloud
  const wordCloudData = ngrams.map((ngram) => ({
    name: ngram.ngram,
    value: ngram.frequency,
    textStyle: {
      // Color based on TF-IDF score (higher score = more blue)
      color: `hsl(${210 - ngram.tf_idf_score * 50}, 70%, ${50 - ngram.tf_idf_score * 10}%)`,
    },
  }));

  const option = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const ngram = ngrams.find((n) => n.ngram === params.name);
        return `
          <div class="font-semibold">${params.name}</div>
          <div>Frequency: ${params.value}</div>
          <div>TF-IDF: ${ngram?.tf_idf_score.toFixed(4) || "N/A"}</div>
        `;
      },
    },
    series: [
      {
        type: "wordCloud" as any,
        shape: "circle",
        left: "center",
        top: "center",
        width: "90%",
        height: "90%",
        right: null,
        bottom: null,
        sizeRange: [12, 60],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        layoutAnimation: true,
        textStyle: {
          fontFamily: "sans-serif",
          fontWeight: "bold",
        },
        emphasis: {
          focus: "self",
          textStyle: {
            shadowBlur: 10,
            shadowColor: "#333",
          },
        },
        data: wordCloudData,
      },
    ],
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <ReactECharts option={option as any} style={{ height: "600px" }} />
    </div>
  );
}
