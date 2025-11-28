import clsx from "clsx";
import * as React from "react";
import { FieldError } from "react-hook-form";

type FormGroupProps = {
  id?: string;
  label: string;
  hiddenLabel?: boolean;
  layout?: "row" | "block";
  className?: string;
  children: React.ReactNode;
  error?: FieldError | undefined;
  description?: string;
};

export type FormGroupPassThroughProps = Omit<FormGroupProps, "children" | "id">;

export const FormGroup = ({
  id,
  label,
  hiddenLabel = false,
  layout = "block",
  className,
  children,
  error,
  description,
}: FormGroupProps) => {
  return (
    <div
      className={clsx(
        "flex min-w-0 flex-col", // "min-w-0" = flex not shooting over parent container
        layout === "row" && "sm:grid sm:grid-cols-3 sm:gap-4",
        className,
      )}
    >
      <label
        htmlFor={id}
        className={clsx(
          "mb-1 block text-base font-medium text-gray-700",
          hiddenLabel && "sr-only",
        )}
      >
        {label}
      </label>
      <div className={clsx(layout === "row" && "sm:col-span-2")}>
        {children}
        {description && (
          <div className="mt-1.5 whitespace-pre-line text-sm text-gray-500">
            {description}
          </div>
        )}
        {error?.message && (
          <div
            role="alert"
            aria-label={error.message}
            className="mt-1 text-sm text-red-600"
          >
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
};
