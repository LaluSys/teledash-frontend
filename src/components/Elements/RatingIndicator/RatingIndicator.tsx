import { mdiInformationOutline } from "@mdi/js";
import Icon from "@mdi/react";
import Tippy from "@tippyjs/react";
import clsx from "clsx";

type RatingIndicatorProps = {
  rating: number;
  description?: string;
  type?: "linear" | "gauge";
  className?: string;
  size?: "sm" | "lg";
};

export function RatingIndicator({
  rating,
  description,
  className,
  type = "linear",
  size = "sm",
}: RatingIndicatorProps) {
  return type === "linear" ? (
    <LinearRatingIndicator
      rating={rating}
      description={description}
      className={className}
      size={size}
    />
  ) : (
    <GaugeRatingIndicator
      rating={rating}
      className={className}
      description={description}
      size={size}
    />
  );
}

function LinearRatingIndicator({
  rating,
  description,
  className,
  size = "sm",
}: RatingIndicatorProps) {
  const barHeight = size === "lg" ? 8 : 6;
  const svgHeight = size === "lg" ? 24 : 18;
  const textClass = size === "lg" ? "text-sm" : "text-xs";
  const iconSize = size === "lg" ? 0.75 : 0.6;

  return (
    <div
      className={clsx(
        "flex items-center justify-between",
        size === "lg" ? "gap-3" : "gap-2",
        className,
      )}
    >
      <svg width="100%" height={svgHeight}>
        {/* Background (gray) */}
        <rect
          x="0"
          y={(svgHeight - barHeight) / 2}
          width="100%"
          height={barHeight}
          fill="#e4e4e7"
          rx={barHeight / 2}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
            <stop offset="0%" stopColor="#86efac" />{" "}
            <stop offset="50%" stopColor="#fde047" />{" "}
            <stop offset="100%" stopColor="#fca5a5" />{" "}
          </linearGradient>
        </defs>

        {/* Colored progress bar */}
        <rect
          x="0"
          y={(svgHeight - barHeight) / 2}
          width={`${Math.round(rating * 100)}%`}
          height={barHeight}
          fill="url(#gradient)"
          rx={barHeight / 2}
        />
      </svg>
      <span className={clsx(textClass, "font-medium")}>
        {`${Math.round(rating * 100)}%`}
      </span>
      {description && (
        <Tippy content={description}>
          <Icon
            path={mdiInformationOutline}
            size={iconSize}
            className="flex-shrink-0 text-gray-500"
          />
        </Tippy>
      )}
    </div>
  );
}

function GaugeRatingIndicator({
  rating,
  description,
  className,
  size = "sm",
}: RatingIndicatorProps) {
  const svgWidth = size === "lg" ? 60 : 48;
  const svgHeight = size === "lg" ? 25 : 22;
  const strokeWidth = size === "lg" ? 8 : 6;
  const textClass = size === "lg" ? "text-lg" : "text-sm";
  const iconSize = size === "lg" ? 0.75 : 0.6;

  return (
    <div className={clsx("flex items-center gap-1", className)}>
      <svg width={svgWidth} height={svgHeight} viewBox="0 0 100 25">
        <defs>
          <linearGradient id="tachGradient" x1="0%" y1="0%" x2="100%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#fca5a5" />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <path
          d="M 10 35 A 10 10 0 0 1 90 35"
          fill="none"
          stroke="#e4e4e7"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Colored progress arc */}
        <path
          d="M 10 35 A 10 10 0 0 1 90 35"
          fill="none"
          stroke="url(#tachGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="125.66"
          strokeDashoffset={125.66 * (1 - rating)}
        />
        {/* Percentage text */}
        <text
          x="50"
          y="30"
          textAnchor="middle"
          className={clsx(textClass, "font-bold")}
        >
          {Math.round(rating * 100)}%
        </text>
      </svg>
      {description && (
        <Tippy content={description}>
          <Icon
            path={mdiInformationOutline}
            size={iconSize}
            className="flex-shrink-0 text-gray-500"
          />
        </Tippy>
      )}
    </div>
  );
}
