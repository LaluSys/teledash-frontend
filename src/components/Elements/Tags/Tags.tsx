import { mdiCheck } from "@mdi/js";
import Icon from "@mdi/react";
import { clsx } from "clsx";
import {
  AutocompleteDropdown,
  Badge,
  sizes,
  variants,
  variantsBorder,
} from "components/Elements";
import { Form } from "components/Form";
import { useClickOutside } from "hooks/useClickOutside";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

const variantsBorderFocus = {
  indigo: "border focus:border-indigo-300",
  orange: "border focus:border-orange-300",
  gray: "border focus:border-gray-300",
  red: "border focus:border-red-300",
  yellow: "border focus:border-yellow-300",
  green: "border focus:border-green-300",
  blue: "border focus:border-blue-300",
  purple: "border focus:border-purple-300",
  pink: "border focus:border-pink-300",
};

const submitButtonVariants = {
  indigo:
    "bg-indigo-100 text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none",
  orange:
    "bg-orange-100 text-orange-400 hover:bg-orange-200 hover:text-orange-500 focus:bg-orange-500 focus:text-white focus:outline-none",
  gray: "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:bg-gray-500 focus:text-white focus:outline-none",
  red: "bg-red-100 text-red-400 hover:bg-red-200 hover:text-red-500 focus:bg-red-500 focus:text-white focus:outline-none",
  yellow:
    "bg-yellow-100 text-yellow-400 hover:bg-yellow-200 hover:text-yellow-500 focus:bg-yellow-500 focus:text-white focus:outline-none",
  green:
    "bg-green-100 text-green-400 hover:bg-green-200 hover:text-green-500 focus:bg-green-500 focus:text-white focus:outline-none",
  blue: "bg-blue-100 text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none",
  purple:
    "bg-purple-100 text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:bg-purple-500 focus:text-white focus:outline-none",
  pink: "bg-pink-100 text-pink-400 hover:bg-pink-200 hover:text-pink-500 focus:bg-pink-500 focus:text-white focus:outline-none",
};

export const addTagInputSchema = z.object({
  add_tag: z.string().min(1).max(32),
});

export type AddTagInput = z.infer<typeof addTagInputSchema>;

export type TagsProps = {
  tags?: string[] | null;
  variant?: keyof typeof variants;
  size?: "sm" | "md" | "lg";
  minTagsShown?: number;
};

type TagsMutationsProps = {
  onClick?: (tag: string) => void;
  addTag?: (tag: string) => Promise<void>;
  removeTag?: (tag: string) => Promise<void>;
  availableTags?: string[];
};

export function Tags({
  onClick,
  tags,
  variant = "indigo",
  size = "md",
  addTag,
  removeTag,
  availableTags = [],
  minTagsShown = 5,
}: TagsProps & TagsMutationsProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [currentInputValue, setCurrentInputValue] = useState("");
  const onClickOutsideRef = useClickOutside(() => setShowTagInput(false));

  const addTagInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showTagInput) {
      addTagInputRef.current?.focus();
    }
  }, [showTagInput]);

  return (
    <>
      {tags && tags?.length > 0 && (
        <>
          {tags
            .slice(0, showAllTags ? tags.length : minTagsShown)
            .map((tag) => (
              <Badge
                key={tag}
                label={tag}
                title={`Add filter for ${tag}`}
                variant={variant}
                size={size}
                onClick={onClick ? () => onClick(tag) : undefined}
                onClose={
                  removeTag &&
                  ((e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  })
                }
              />
            ))}
          {tags.length > minTagsShown && !showAllTags && (
            <button onClick={() => setShowAllTags(true)} title="Show all tags">
              <Badge
                key="..."
                label="..."
                title={
                  tags.length -
                  minTagsShown +
                  (tags.length === 4 ? " more tag" : " more tags")
                }
                variant={variant}
                size="md"
              />
            </button>
          )}
        </>
      )}

      {addTag && (
        <>
          <Form<AddTagInput, typeof addTagInputSchema>
            onSubmit={async (data) => {
              try {
                await addTag(data.add_tag);
                setCurrentInputValue("");
                setShowTagInput(false);
              } catch (error) {
                // TODO: Display the error message inside of the form.
                console.error(error);
              }
            }}
            schema={addTagInputSchema}
            className={showTagInput ? "block" : "hidden"}
          >
            {({ register, formState, setValue }) => {
              const { ref, ...rest } = register("add_tag");

              return (
                <span className="relative" ref={onClickOutsideRef}>
                  <input
                    id="add-tag"
                    type="text"
                    placeholder="Enter new tag…"
                    className={clsx(
                      "w-full truncate rounded-full pr-6 text-sm font-medium focus:ring-0",
                      sizes[size],
                      variants[variant],
                      variantsBorder[variant],
                      variantsBorderFocus[variant],
                    )}
                    ref={(e) => {
                      ref(e);
                      addTagInputRef.current = e;
                    }}
                    {...rest}
                    onChange={(e) => {
                      rest.onChange(e); // Pass event to react-hook-form handler
                      setCurrentInputValue(e.target.value);
                    }}
                  />
                  <button
                    type="submit"
                    className={clsx(
                      "absolute right-3 top-1/2 -mr-1 ml-0.5 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full disabled:invisible",
                      submitButtonVariants[variant],
                    )}
                    title="Add new tag"
                    disabled={!formState.isValid}
                  >
                    <Icon path={mdiCheck} size={0.75} />
                  </button>

                  {
                    // The input element is not rendered conditionally to preserve its state when closing/reopening it.
                    // AutocompleteDropdown is only suppposed to be rendered when showTagInput is true though.
                    showTagInput && (
                      <AutocompleteDropdown
                        inputValue={currentInputValue}
                        onSelect={(suggestion) => {
                          setValue("add_tag", suggestion.label);
                          setCurrentInputValue(suggestion.label);
                        }}
                        options={availableTags.map((tag) => ({ label: tag }))}
                      />
                    )
                  }
                </span>
              );
            }}
          </Form>
          <Badge
            className={showTagInput ? "hidden" : "block"}
            onClick={() => setShowTagInput(true)}
            key="+"
            label="+"
            title="Add tag"
            variant={variant}
            size={size}
          />
        </>
      )}
    </>
  );
}
