import { startCase } from "lodash";
import { useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { SearchFormInputs } from "..";

import {
  AutocompleteRepeater,
  ControlledRadioGroup,
  FormGroup,
  SelectInputGroup,
  TextInput,
} from "components/Form";
import { useChatNames } from "features/chats";
import { defaultQueryParams } from "features/messages";
import { useTags } from "features/tags";
import { createDisplayNameFromUser, useUserNames } from "features/users";

import { MessageAttachmentType, MessageSearchType } from "types";
import { useChatsStats } from "features/chats/api/getChatsStats";

const dateInputOptions = {
  pattern: {
    value: /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/,
    message: "Please enter a date and time (YYYY-MM-DDThh:mm)",
  },
};

const searchTypeOptions: MessageSearchType[] = [
  "exact",
  "flexible",
  "fuzzy",
  "semantic_text",
  "semantic_image",
];

export function MessageFilter({ className }: { className?: string }) {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext<SearchFormInputs>();

  const from_user_ids = useFieldArray({
    name: "messages.from_user_ids",
    control,
  });

  const chat_ids = useFieldArray({
    name: "messages.chat_ids",
    control,
  });

  const tags = useFieldArray({
    name: "messages.tags",
    control,
  });

  const chat_tags = useFieldArray({
    name: "messages.chat_tags",
    control,
  });

  const tagList = useTags().data;
  const tagOptions = useMemo(
    () => tagList?.map((tag) => ({ label: tag })) ?? [],
    [tagList],
  );

  const chatTagList = useChatsStats().data;
  const chatTagOptions = useMemo(
    () => chatTagList?.tags?.map((tag) => ({ label: tag.value })) ?? [],
    [chatTagList],
  );

  const chatNames = useChatNames();
  const chatOptions = useMemo(
    () =>
      chatNames.map((chat) => ({
        label: chat.title ?? chat.id.toString(),
        value: chat.title ? chat.id : undefined,
      })),
    [chatNames],
  );

  const userNames = useUserNames();
  const userOptions = useMemo(
    () =>
      userNames.map((user) => ({
        label: createDisplayNameFromUser(user),
        value: user.id,
      })),
    [userNames],
  );

  const currentSearchType = watch("messages.search_type");

  const searchTypeDescriptions: Record<MessageSearchType, string> = {
    exact: `Must exactly match the search terms. It's case-insensitive. Use "" to search for exact phrases.
          Use - (minus) to exclude single terms.\n
          Examples: "meeting notes" will match exactly that phrase; meeting -zoom will find meetings but exclude zoom; coffee will match only "coffee" (not "coffeeshop").`,
    flexible: `Standard keyword search using language-aware processing. It's case-insensitive and handles things like stemming.\n
          Example: Searching "running" will also match "run".`,
    fuzzy: `Tolerates minor typos or spelling differences. The allowed edit distance is calculated automatically.\n
          Example: Searching "recieve" will still match "receive".`,
    semantic_text: `Finds results based on meaning, not just exact words.\n
          Example: Searching "how to fix a bike tire" might return results about "repairing a flat bicycle tire".`,
    semantic_image: `Finds results based on image content.\n
          Example: Searching for an image of a "sunset over mountains" will return similar images.`,
  };

  return (
    <div className={`space-y-5 divide-y divide-gray-200 ${className}`}>
      <FormGroup
        label="Search Type"
        layout="row"
        description={
          currentSearchType
            ? searchTypeDescriptions[currentSearchType]
            : undefined
        }
      >
        <ControlledRadioGroup<SearchFormInputs>
          label="Search Type"
          hiddenLabel={true}
          fieldName={"messages.search_type"}
          control={control}
          defaultValue={defaultQueryParams?.search_type}
          options={searchTypeOptions.map((option) => ({
            label: startCase(option),
            value: option,
          }))}
        />
      </FormGroup>
      <FormGroup
        label="From user(s)"
        layout="row"
        description="Only show messages from the selected user(s)."
        className="pt-5"
      >
        <AutocompleteRepeater
          inputType="text"
          fields={from_user_ids.fields}
          onRegister={(index) =>
            register(`messages.from_user_ids.${index}.label`)
          }
          onAppend={() =>
            from_user_ids.append({ label: undefined, value: undefined })
          }
          onRemove={(index) => from_user_ids.remove(index)}
          autocompleteOnSelect={(suggestion, index) => {
            from_user_ids.update(index, {
              label: suggestion.label,
              value: suggestion.value,
            });
          }}
          autocompleteOptions={userOptions}
        />
      </FormGroup>
      <FormGroup
        label="In chat(s)"
        layout="row"
        description="Only show messages from the selected chat(s)."
        className="pt-5"
      >
        <AutocompleteRepeater
          inputType="text"
          fields={chat_ids.fields}
          onRegister={(index) => register(`messages.chat_ids.${index}.label`)}
          onAppend={() =>
            chat_ids.append({ label: undefined, value: undefined })
          }
          onRemove={(index) => chat_ids.remove(index)}
          autocompleteOnSelect={(suggestion, index) => {
            chat_ids.update(index, {
              label: suggestion.label,
              value: suggestion.value,
            });
          }}
          autocompleteOptions={chatOptions}
        />
      </FormGroup>
      <FormGroup
        label="Tags"
        layout="row"
        description="Only show messages using all of the selected tags."
        className="pt-5"
      >
        <AutocompleteRepeater
          inputType="text"
          fields={tags.fields}
          onRegister={(index) => register(`messages.tags.${index}.value`)}
          onAppend={() => tags.append({ value: undefined })}
          onRemove={(index) => tags.remove(index)}
          autocompleteOnSelect={(suggestion, index) => {
            tags.update(index, { value: suggestion.label });
          }}
          autocompleteOptions={tagOptions}
        />
      </FormGroup>
      <FormGroup
        label="Chat Tags"
        layout="row"
        description="Only show messages from chats using one of the selected tags."
        className="pt-5"
      >
        <AutocompleteRepeater
          inputType="text"
          fields={chat_tags.fields}
          onRegister={(index) => register(`messages.chat_tags.${index}.value`)}
          onAppend={() => chat_tags.append({ value: undefined })}
          onRemove={(index) => chat_tags.remove(index)}
          autocompleteOnSelect={(suggestion, index) => {
            chat_tags.update(index, { value: suggestion.label });
          }}
          autocompleteOptions={chatTagOptions}
        />
      </FormGroup>
      <SelectInputGroup<MessageAttachmentType>
        label="Attachment type"
        id="attachment-type-field"
        layout="row"
        className="pt-5"
        options={[
          { label: "All", value: "" },
          { label: "Audio", value: "audio" },
          { label: "Document", value: "document" },
          { label: "Photo", value: "photo" },
          { label: "Sticker", value: "sticker" },
          { label: "Video", value: "video" },
          { label: "Animation", value: "animation" },
          { label: "Voice", value: "voice" },
          { label: "Video Note", value: "video_note" },
          { label: "Contact", value: "contact" },
          { label: "Location", value: "location" },
          { label: "Venue", value: "venue" },
          { label: "Poll", value: "poll" },
          { label: "Web Page", value: "web_page" },
          { label: "Dice", value: "dice" },
          { label: "Game", value: "game" },
        ]}
        defaultValue=""
        registration={register("messages.attachment_type")}
      />
      <FormGroup
        label="Time range"
        layout="row"
        description="Filter messages within a time range."
        className="pt-5"
      >
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
          {/* TODO: Why don't we use TextInputGroup here? */}
          <FormGroup label="From" layout="block">
            <TextInput
              type="datetime-local"
              registration={register("messages.date_from", dateInputOptions)}
              error={errors["messages"]?.date_from}
            />
          </FormGroup>
          <FormGroup label="To" layout="block">
            <TextInput
              type="datetime-local"
              registration={register("messages.date_to", dateInputOptions)}
              error={errors["messages"]?.date_to}
            />
          </FormGroup>
        </div>
      </FormGroup>
      {/* <FormGroup
        id="is-empty-field"
        label="Flags"
        layout="row"
        className="pt-5"
      >
        <Checkbox
          id="is-empty-field"
          label="Is empty"
          hint='Messages that are "empty" are deleted messaged.'
          defaultChecked={false}
          registration={register("messages.is_empty")}
        />
      </FormGroup> */}
    </div>
  );
}
