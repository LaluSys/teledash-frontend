import clsx from "clsx";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { FormGroup, FormGroupPassThroughProps } from "components/Form";

type TextareaProps = {
  id?: string;
  rows?: number;
  className?: string;
  registration: Partial<UseFormRegisterReturn>;
  error?: FieldError | undefined;
};

type TextareaGroupProps = FormGroupPassThroughProps & TextareaProps;

export const Textarea = ({
  id,
  rows = 4,
  className,
  registration,
  error,
}: TextareaProps) => {
  return (
    <textarea
      id={id}
      rows={rows}
      className={clsx(
        "block w-full rounded-md border border-gray-300 shadow-sm",
        "focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
        {
          "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-100":
            error,
        },
        className,
      )}
      {...registration}
    />
  );
};

export const TextareaGroup = (props: TextareaGroupProps) => {
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
      <Textarea
        id={props.id}
        rows={props.rows}
        // className={props.className} // classname applies to FormGroup
        registration={props.registration}
        error={props.error}
      />
    </FormGroup>
  );
};
