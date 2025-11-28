import { useState } from "react";
import { FieldArrayWithId, UseFormRegisterReturn } from "react-hook-form";

import { Button, AutocompleteDropdown } from "components/Elements";
import { TextInput, TextInputProps } from "components/Form";

type RepeaterProps = {
  fields: FieldArrayWithId[];
  inputType: TextInputProps["type"];
  onRegister: (index: number) => Partial<UseFormRegisterReturn>;
  onAppend: () => void;
  onRemove: (index: number) => void;
};

export function Repeater({
  fields,
  inputType,
  onRegister,
  onAppend,
  onRemove,
}: RepeaterProps) {
  return (
    <div className="space-y-4">
      {!fields.length && (
        <Button variant="secondary" onClick={onAppend}>
          Add
        </Button>
      )}
      {fields.map((item, index) => (
        <div key={item.id} className="flex space-x-2">
          <div className="flex flex-grow flex-col">
            <TextInput type={inputType} registration={onRegister(index)} />
          </div>

          <Button variant="secondary" onClick={() => onRemove(index)}>
            -
          </Button>
          {index === fields.length - 1 && (
            <Button variant="secondary" onClick={onAppend}>
              +
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

type AutocompleteRepeaterProps = RepeaterProps & {
  autocompleteOnSelect: (
    suggestion: { label: string; value?: number },
    index: number,
  ) => void;
  autocompleteOptions: { label: string; value?: number }[];
};

export const AutocompleteRepeater = ({
  fields,
  inputType,
  onRegister,
  onAppend,
  onRemove,
  autocompleteOnSelect,
  autocompleteOptions,
}: AutocompleteRepeaterProps) => {
  const [focusedStates, setFocusedStates] = useState<Record<string, boolean>>(
    {},
  );
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  return (
    <div className="space-y-4">
      {!fields.length && (
        <Button variant="secondary" onClick={onAppend}>
          Add
        </Button>
      )}
      {fields.map((item, index) => {
        const registration = onRegister(index);
        registration.onChange = async (e) => {
          setInputValues((prev) => ({ ...prev, [item.id]: e.target.value }));

          // If the input value exactly matches one remaining option, select it.
          const matchingOptions = autocompleteOptions.filter(
            (option) =>
              option.label.toLowerCase() === e.target.value.toLowerCase(),
          );

          if (matchingOptions.length === 1) {
            autocompleteOnSelect(matchingOptions[0], index);
          }
        };

        return (
          <div key={item.id} className="flex space-x-2">
            <div
              className="flex flex-grow flex-col"
              // Using onFocus and onBlur on the wrapping div allows having
              // onBlur to only fire if clicking outside of it.
              onFocus={() =>
                setFocusedStates((prev) => ({ ...prev, [item.id]: true }))
              }
              onBlur={(event: React.FocusEvent<HTMLDivElement>) => {
                // onBlur is fired when any child element loses focus.
                // We only want to fire it if the focus is leaving the entire
                // div.
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null,
                  )
                ) {
                  setFocusedStates((prev) => ({ ...prev, [item.id]: false }));
                }
              }}
              // tabIndex -1 is necessary to make the div focusable.
              tabIndex={-1}
            >
              <TextInput type={inputType} registration={registration} />
              {focusedStates[item.id] && (
                <AutocompleteDropdown
                  inputValue={inputValues[item.id]}
                  onSelect={(suggestion) =>
                    autocompleteOnSelect(suggestion, index)
                  }
                  options={autocompleteOptions}
                />
              )}
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                onRemove(index);
                setInputValues(({ [item.id]: _, ...rest }) => rest);
                setFocusedStates(({ [item.id]: _, ...rest }) => rest);
              }}
            >
              -
            </Button>
            {index === fields.length - 1 && (
              <Button variant="secondary" onClick={onAppend}>
                +
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};
