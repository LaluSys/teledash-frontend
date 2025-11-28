import { mdiMessage, mdiMessageBadge } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";

import { Spinner } from "components/Elements";
import { formatNumber } from "utils/formatNumber";

const variants = {
  total: {
    className: "text-gray-600",
    icon: mdiMessage,
    description: "Messages",
  },
  unread: {
    className: "text-green-600",
    icon: mdiMessageBadge,
    description: "Unread Messages",
  },
};

export function MessagesCount({
  count,
  variant = "total",
  status,
}: {
  count?: number;
  variant?: keyof typeof variants;
  status: "error" | "success" | "pending";
}) {
  const countFormatted = formatNumber(count ?? 0);

  return (
    <div
      className={clsx("flex items-center space-x-1", {
        "opacity-50": status === "error",
      })}
      title={countFormatted + " " + variants[variant].description}
    >
      {variants[variant].icon && (
        <Icon
          path={variants[variant].icon}
          size={1}
          className={variants[variant].className}
        />
      )}

      {status === "pending" ? (
        <Spinner size="sm" />
      ) : status === "success" ? (
        <span className={clsx("font-medium", variants[variant].className)}>
          {countFormatted}
        </span>
      ) : (
        "?"
      )}
    </div>
  );
}
