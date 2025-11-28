import Icon from "@mdi/react";
import clsx from "clsx";
import { HTMLInputAutoCompleteAttribute } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { FormGroup, FormGroupPassThroughProps } from "components/Form";

export type TextInputProps = {
  id?: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "search"
    | "number"
    | "date"
    | "datetime-local"
    | "tel";
  startIcon?: string;
  placeholder?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  className?: string;
  registration: Partial<UseFormRegisterReturn>;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: FieldError | undefined;
};

type TextInputGroupProps = FormGroupPassThroughProps & TextInputProps;

export const TextInput = ({
  type = "text",
  startIcon,
  className,
  registration,
  error,
  ...rest
}: TextInputProps) => {
  return (
    <div className={clsx(startIcon && "relative", className)}>
      {startIcon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon
            path={startIcon}
            size={0.9}
            aria-hidden="true"
            className="text-gray-400"
          />
        </div>
      )}
      <input
        type={type}
        // TODO: Use zod to manage this more neatly.
        // By setting a max date we prevent browsers from accepting years with more than four digits.
        max={type === "datetime-local" ? "9999-12-31T23:59" : undefined}
        className={clsx(
          "block w-full appearance-none rounded-md px-3 py-2.5 shadow-sm autofill:bg-white",
          "border border-gray-300 placeholder-gray-400",
          "focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
          "disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400",
          {
            "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500":
              error,
          },
          { "pl-10": startIcon },
        )}
        {...registration}
        {...rest}
      />
    </div>
  );
};

export const TextInputGroup = (props: TextInputGroupProps) => {
  return (
    <FormGroup
      id={props.id}
      label={props.label}
      hiddenLabel={props.hiddenLabel}
      layout={props.layout}
      className={props.className}
      error={props.error}
      description={props.description}
    >
      <TextInput
        id={props.id}
        type={props.type}
        startIcon={props.startIcon}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        // className={props.className} // classname applies to FormGroup
        registration={props.registration}
        error={props.error}
      />
    </FormGroup>
  );
};
