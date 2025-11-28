import { useFieldArray, useFormContext } from "react-hook-form";

import { SearchFormInputs } from "..";

import {
  Checkbox,
  SelectInputGroup,
  FormGroup,
  Repeater,
} from "components/Form";

import { ChatType } from "types";

export function ChatFilter({ className }: { className?: string }) {
  const {
    register,
    control,
    formState: { errors },
    getFieldState,
  } = useFormContext<SearchFormInputs>();

  const tags = useFieldArray({
    name: "chats.tags",
    control,
  });

  return (
    <div className={`space-y-5 divide-y divide-gray-200 ${className}`}>
      <SelectInputGroup<ChatType>
        id="chat-type-field"
        label="Chat type"
        layout="row"
        // RHF tracks state for nested structures and uses the "type" field
        // itself on each level, which results in RHF's "type" and chats' "type"
        // getting merged. By using getFieldState we get the state of the leaf
        // directly.
        error={getFieldState("chats.type").error}
        options={[
          { label: "All", value: "" },
          { label: "Group", value: "GROUP" },
          { label: "Supergroup", value: "SUPERGROUP" },
          { label: "Channel", value: "CHANNEL" },
        ]}
        defaultValue=""
        registration={register("chats.type")}
      />
      <FormGroup label="Flags" layout="row" className="pt-5">
        <div className="space-y-4">
          <Checkbox
            id="is-verified"
            label="Is verified"
            hint="Chats that have been verified by Telegram. Supergroups, channels and bots only."
            defaultChecked={false}
            registration={register("chats.is_verified")}
            error={errors.chats?.is_verified}
          />
          <Checkbox
            id="is-restricted"
            label="Is restricted"
            hint="Chats that have been restricted. Supergroups, channels and bots only."
            defaultChecked={false}
            registration={register("chats.is_restricted")}
            error={errors.chats?.is_restricted}
          />
          <Checkbox
            id="is-scam"
            label="Is scam"
            hint="Chats that have been flagged for scam."
            defaultChecked={false}
            registration={register("chats.is_scam")}
            error={errors.chats?.is_scam}
          />
          <Checkbox
            id="is-fake"
            label="Is fake"
            hint="Chats that have been flagged for impersonation."
            defaultChecked={false}
            registration={register("chats.is_fake")}
            error={errors.chats?.is_fake}
          />
        </div>
      </FormGroup>
      <FormGroup
        label="Tags"
        layout="row"
        description="Only show chats using all of the selected tags."
        className="pt-5"
      >
        {/* TODO: Use AutocompleteRepeater when API allows retrieving all chat tags. */}
        <Repeater
          inputType="text"
          fields={tags.fields}
          onRegister={(index) => register(`chats.tags.${index}.value`)}
          onAppend={() => tags.append({ value: undefined })}
          onRemove={(index) => tags.remove(index)}
        />
      </FormGroup>
    </div>
  );
}
