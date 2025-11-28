import {
  RadioGroup as HeadlessRadioGroup,
  Label,
  Radio,
} from "@headlessui/react";
import Icon from "@mdi/react";
import clsx from "clsx";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

type RadioGroupOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string;
};

type RadioGroupProps = {
  label: string;
  hiddenLabel?: boolean;
  value: string;
  options: RadioGroupOption[];
  onChange: (...event: any[]) => void;
};

export const RadioGroup = ({
  label,
  hiddenLabel = false,
  value,
  options,
  onChange,
}: RadioGroupProps) => {
  const lastOptionIndex = options.length - 1;

  return (
    <HeadlessRadioGroup value={value} onChange={onChange}>
      <Label
        className={clsx("block font-medium text-gray-700", {
          "sr-only": hiddenLabel,
        })}
      >
        {label}
      </Label>

      <div className="relative z-0 mt-1 flex flex-col lg:inline-flex lg:flex-row">
        {options.map((option, index) => (
          <Radio
            key={option.label}
            value={option.value}
            className={({ focus, checked }) =>
              clsx(
                "inline-flex items-center px-3 py-3",
                "text-sm font-medium uppercase",
                "focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                "border bg-white shadow-sm hover:bg-gray-50",
                index === 0 &&
                  "rounded-t-md lg:rounded-bl-md lg:rounded-tl-md lg:rounded-tr-none",
                index === lastOptionIndex &&
                  "rounded-b-md lg:rounded-bl-none lg:rounded-br-md lg:rounded-tr-md",
                focus ? "z-10" : "",
                checked
                  ? "border-indigo-500 text-indigo-600"
                  : "border-gray-300 text-gray-900",
                option.disabled
                  ? "cursor-not-allowed opacity-25"
                  : "cursor-pointer",
              )
            }
            disabled={option.disabled}
          >
            <Label as="p">{option.label}</Label>
            {option.icon && (
              <Icon
                path={option.icon}
                size={0.8}
                aria-hidden="true"
                className="ml-1"
              />
            )}
          </Radio>
        ))}
      </div>
    </HeadlessRadioGroup>
  );
};

type ControlledRadioGroupProps<T extends FieldValues> = {
  control: Control<T>;
  fieldName: Path<T>;
  defaultValue?: PathValue<T, Path<T>>;
} & Omit<RadioGroupProps, "onChange" | "value">;

export function ControlledRadioGroup<T extends FieldValues>({
  label,
  hiddenLabel = false,
  options,
  control,
  fieldName,
  defaultValue,
}: ControlledRadioGroupProps<T>) {
  return (
    <Controller
      name={fieldName}
      defaultValue={defaultValue}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <RadioGroup
            label={label}
            hiddenLabel={hiddenLabel}
            value={field.value}
            options={options}
            onChange={field.onChange}
          />
          {fieldState.error && (
            <div className="mt-2 text-sm text-red-600">
              {fieldState.error.message}
            </div>
          )}
        </>
      )}
    />
  );
}
