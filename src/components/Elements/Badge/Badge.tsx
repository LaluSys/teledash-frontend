import clsx from "clsx";
import { MouseEventHandler } from "react";

import {
  variantsCloseButton,
  variants,
  variantsBorder,
  variantsOnClick,
} from "components/Elements";

const closeButtonSizes = {
  sm: "h-4 w-4 ml-0.5 -mr-1",
  md: "h-4 w-4 ml-0.5 -mr-1.5",
  lg: "h-6 w-6 ml-1 -mr-2.5",
};

const closeButtonIconSizes = {
  sm: "h-2 w-2",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
};

export const sizes = {
  sm: "px-2.5 py-0.5 text-xs",
  md: "px-3 py-0.5 text-sm",
  lg: "px-3 py-1 text-base",
};

export type BadgeProps = {
  label: string;
  /** An optional html-title. When none, label is used as html-title.  */
  title?: string;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  hasBorder?: boolean;
  onClick?: MouseEventHandler;
  onClose?: MouseEventHandler;
  className?: string;
};

export const Badge = ({
  label,
  title,
  size = "sm",
  variant = "orange",
  hasBorder = false,
  onClick,
  onClose,
  className,
}: BadgeProps) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center truncate rounded-full font-medium",
        sizes[size],
        variants[variant],
        { [variantsBorder[variant]]: hasBorder },
        { [variantsOnClick[variant]]: onClick },
        className,
      )}
      title={title ?? label}
      onClick={onClick}
    >
      <span className="w-full truncate">{label}</span>
      {onClose && (
        <button
          type="button"
          className={clsx(
            "inline-flex flex-shrink-0 items-center justify-center rounded-full focus:outline-none",
            variantsCloseButton[variant],
            closeButtonSizes[size],
          )}
          onClick={onClose}
          title="Remove"
        >
          <span className="sr-only">Remove</span>
          <svg
            className={closeButtonIconSizes[size]}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 8 8"
          >
            <path
              strokeLinecap="round"
              strokeWidth="1.5"
              d="M1 1l6 6m0-6L1 7"
            />
          </svg>
        </button>
      )}
    </span>
  );
};
