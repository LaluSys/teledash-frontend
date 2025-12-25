import { useState } from "react";
import { mdiPlay } from "@mdi/js";
import Icon from "@mdi/react";

interface NgramConfigFormProps {
  onGenerate: (config: NgramConfig) => void;
  isGenerating?: boolean;
}

export interface NgramConfig {
  n_values: number[];
  min_frequency: number;
  stopwords_language: string;
}

const STOPWORDS_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ar", label: "Arabic" },
  { value: "zh", label: "Chinese" },
];

export function NgramConfigForm({
  onGenerate,
  isGenerating = false,
}: NgramConfigFormProps) {
  const [selectedNValues, setSelectedNValues] = useState<number[]>([2, 3]);
  const [minFrequency, setMinFrequency] = useState<number>(5);
  const [stopwordsLanguage, setStopwordsLanguage] = useState<string>("en");

  const handleNValueToggle = (n: number) => {
    setSelectedNValues((prev) =>
      prev.includes(n) ? prev.filter((val) => val !== n) : [...prev, n]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      n_values: selectedNValues,
      min_frequency: minFrequency,
      stopwords_language: stopwordsLanguage,
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        N-gram Configuration
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* N-gram Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            N-gram Types
          </label>
          <div className="space-y-2">
            {[2, 3, 4].map((n) => (
              <div key={n} className="flex items-center">
                <input
                  id={`ngram-${n}`}
                  type="checkbox"
                  checked={selectedNValues.includes(n)}
                  onChange={() => handleNValueToggle(n)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={`ngram-${n}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {n}-grams
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Minimum Frequency Slider */}
        <div>
          <label
            htmlFor="min-frequency"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Minimum Frequency: {minFrequency}
          </label>
          <input
            id="min-frequency"
            type="range"
            min="1"
            max="50"
            value={minFrequency}
            onChange={(e) => setMinFrequency(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>50</span>
          </div>
        </div>

        {/* Stopwords Language */}
        <div>
          <label
            htmlFor="stopwords-language"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Stopwords Language
          </label>
          <select
            id="stopwords-language"
            value={stopwordsLanguage}
            onChange={(e) => setStopwordsLanguage(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {STOPWORDS_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating || selectedNValues.length === 0}
          className="w-full inline-flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon path={mdiPlay} size={0.8} className="mr-2" />
          {isGenerating ? "Generating..." : "Generate N-grams"}
        </button>

        {selectedNValues.length === 0 && (
          <p className="text-xs text-red-600">
            Please select at least one n-gram type
          </p>
        )}
      </form>
    </div>
  );
}
