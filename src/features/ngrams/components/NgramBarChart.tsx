import { ReactECharts } from "components/Elements";
import type { EChartsOption } from "echarts";
import { Ngram } from "../api";

interface NgramBarChartProps {
  ngrams: Ngram[];
}

export function NgramBarChart({ ngrams }: NgramBarChartProps) {
  if (!ngrams || ngrams.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <p className="text-gray-500">No n-grams available</p>
      </div>
    );
  }

  // Take top 20 n-grams by frequency
  const top20 = [...ngrams]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 20);

  // Prepare data for horizontal bar chart
  const ngramTexts = top20.map((n) => n.ngram);
  const frequencies = top20.map((n) => n.frequency);
  const tfidfScores = top20.map((n) => n.tf_idf_score);

  // Normalize TF-IDF scores for color mapping
  const maxTfidf = Math.max(...tfidfScores);
  const minTfidf = Math.min(...tfidfScores);

  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: any) => {
        const index = params[0].dataIndex;
        const ngram = top20[index];
        return `
          <div class="font-semibold">${ngram.ngram}</div>
          <div>Frequency: ${ngram.frequency}</div>
          <div>TF-IDF: ${ngram.tf_idf_score.toFixed(4)}</div>
          <div>N-gram type: ${ngram.n_value}-gram</div>
        `;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name: "Frequency",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "category",
      data: ngramTexts,
      inverse: true,
      axisLabel: {
        fontSize: 11,
        overflow: "truncate",
        width: 150,
      },
    },
    series: [
      {
        name: "Frequency",
        type: "bar",
        data: frequencies.map((freq, index) => {
          // Color gradient based on TF-IDF score
          const normalized =
            maxTfidf === minTfidf
              ? 0.5
              : (tfidfScores[index] - minTfidf) / (maxTfidf - minTfidf);
          const hue = 210; // Blue hue
          const saturation = 70 + normalized * 30;
          const lightness = 60 - normalized * 20;
          return {
            value: freq,
            itemStyle: {
              color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            },
          };
        }),
        emphasis: {
          focus: "self",
        },
      },
    ],
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <ReactECharts option={option} style={{ height: "800px" }} />
    </div>
  );
}
