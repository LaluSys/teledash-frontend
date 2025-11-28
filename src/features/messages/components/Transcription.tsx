import { mdiChevronDown } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import React, { useState } from "react";
import Tippy from "@tippyjs/react";
import { TranscriptionStatus } from "types";

// This parses <span class='highlight'> tags into React elements.
// It is not able to parse nested tags.
const parseHighlights = (text: string): React.ReactNode[] => {
  const parts = text.split(/<span class='highlight'>|<\/span>/);
  const result: React.ReactNode[] = [];

  for (let i = 0; i < parts.length; i++) {
    if (!parts[i]) continue;

    if (i % 2 === 1) {
      result.push(
        <span key={`highlight-${i}`} className="highlight">
          {parts[i]}
        </span>,
      );
    } else {
      result.push(parts[i]);
    }
  }

  return result;
};

type TranscriptionProps = {
  text?: string | null;
  language?: string | null;
  languageProbability?: number | null;
  status?: TranscriptionStatus | null;
};

export function Transcription({
  text,
  language,
  languageProbability,
  status,
}: TranscriptionProps) {
  const [isTranscriptionOpen, setIsTranscriptionOpen] = useState(false);

  const hasText = text != null;
  const isPending = status === "PENDING";
  const isFailed = status === "FAILURE";

  return (
    <div
      className={clsx(
        "my-1 rounded bg-gray-100 py-1 text-xs",
        "duration-300 ease-in-out",
      )}
    >
      {hasText && (
        <div
          className={clsx(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isTranscriptionOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="m-1 max-h-96 overflow-auto p-2">
            {parseHighlights(text)}
          </div>
        </div>
      )}
      <div
        className={clsx(
          "mx-1 flex justify-center rounded",
          hasText
            ? "cursor-pointer transition-colors duration-300 hover:bg-gray-200"
            : "cursor-default",
        )}
        onClick={() => setIsTranscriptionOpen(!isTranscriptionOpen)}
      >
        <div className="m-1 flex w-full items-center justify-between">
          <div className="flex basis-1/3 items-center gap-1">
            <div className="rounded border border-gray-200 bg-white px-1 text-[.8em] text-gray-600">
              Transcription
            </div>
            {language != null && (
              <div
                className="rounded border border-gray-200 bg-white px-1 text-[.8em] uppercase text-gray-600"
                title={
                  languageProbability
                    ? `Confidence: ${languageProbability}`
                    : undefined
                }
              >
                {language}
              </div>
            )}
            {isPending && (
              <Tippy content="Transcription pending.">
                <div className="mx-1 h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
              </Tippy>
            )}
            {isFailed && (
              <Tippy content="Transcription failed.">
                <div className="mx-1 h-2 w-2 rounded-full bg-red-500" />
              </Tippy>
            )}
          </div>
          {hasText && (
            <Icon
              path={mdiChevronDown}
              size={0.75}
              className={clsx(
                "basis-1/3 transition-transform duration-300",
                isTranscriptionOpen && "rotate-180",
              )}
            />
          )}
          <div className="basis-1/3"></div>
        </div>
      </div>
    </div>
  );
}
