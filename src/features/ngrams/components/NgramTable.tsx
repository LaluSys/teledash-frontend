import { useState, useMemo } from "react";
import { Ngram } from "../api";

interface NgramTableProps {
  ngrams: Ngram[];
  onNgramClick?: (ngram: string) => void;
}

type SortField = "ngram" | "frequency" | "tf_idf_score" | "n_value";
type SortOrder = "asc" | "desc";

export function NgramTable({ ngrams, onNgramClick }: NgramTableProps) {
  const [sortField, setSortField] = useState<SortField>("frequency");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sortedNgrams = useMemo(() => {
    return [...ngrams].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [ngrams, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  if (!ngrams || ngrams.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <p className="text-gray-500">No n-grams available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                onClick={() => handleSort("ngram")}
              >
                N-gram{getSortIndicator("ngram")}
              </th>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                onClick={() => handleSort("n_value")}
              >
                Type{getSortIndicator("n_value")}
              </th>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                onClick={() => handleSort("frequency")}
              >
                Frequency{getSortIndicator("frequency")}
              </th>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                onClick={() => handleSort("tf_idf_score")}
              >
                TF-IDF Score{getSortIndicator("tf_idf_score")}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sortedNgrams.map((ngram, index) => (
              <tr
                key={`${ngram.ngram}-${index}`}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {ngram.ngram}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {ngram.n_value}-gram
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {ngram.frequency.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {ngram.tf_idf_score.toFixed(4)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {onNgramClick && (
                    <button
                      onClick={() => onNgramClick(ngram.ngram)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Messages
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
