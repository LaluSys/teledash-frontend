import clsx from "clsx";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { FormGroup, FormGroupPassThroughProps } from "components/Form";

type OptionValue = string | number | string[];

type Option<T extends OptionValue> = {
  label: string;
  value?: T | ""; // Always allow providing an empty string/option for placeholder
};

type SelectInputProps<T extends OptionValue> = {
  id: string;
  options: Option<T>[];
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  registration: Partial<UseFormRegisterReturn>;
  error?: FieldError | undefined;
};

type SelectInputGroupProps<T extends OptionValue> = FormGroupPassThroughProps &
  SelectInputProps<T>;

export function SelectInput<T extends OptionValue>({
  id,
  options,
  className,
  defaultValue,
  placeholder,
  registration,
  error,
}: SelectInputProps<T>) {
  return (
    <div className={className}>
      <select
        id={id}
        className={clsx(
          "block w-full rounded-md border-gray-300 py-2.5 pl-3 pr-10 text-base shadow-sm",
          "focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
          {
            "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-100":
              error,
          },
        )}
        defaultValue={defaultValue}
        {...registration}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map(({ label, value }) => (
          <option key={label?.toString()} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SelectInputGroup<T extends OptionValue>(
  props: SelectInputGroupProps<T>,
) {
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
      <SelectInput
        id={props.id}
        options={props.options}
        // className={props.className} // classname applies to FormGroup
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        registration={props.registration}
        error={props.error}
      />
    </FormGroup>
  );
}
