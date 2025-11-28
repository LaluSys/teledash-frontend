import {
  GetChatsParams,
  GetMessagesParams,
  GetUsersParams,
  MessageSearchType,
  MessageAttachmentType,
  MessageSortBy,
  OrderEnum,
  ChatType,
  ChatSortBy,
} from "types";

export type FilterKeys = "chats" | "messages" | "users";

export type FilterValues<T> = T extends "chats"
  ? GetChatsParams
  : T extends "messages"
    ? GetMessagesParams
    : T extends "users"
      ? GetUsersParams
      : never;

export type UpdateFiltersOptions =
  | { key: "chats"; params: GetChatsParams | undefined }
  | { key: "messages"; params: GetMessagesParams | undefined }
  | { key: "users"; params: GetUsersParams | undefined };

// messages: GetMessagesParams & {
//   from_user_ids?: { label: string | undefined; value: number | undefined }[];
//   chat_ids?: { label: string | undefined; value: number | undefined }[];
//   tags?: { value: string | undefined }[];
// };
// TODO: TypeScript is unable to properly replace the type of `from_user_ids`
// and `chat_ids`. Above code does not replace the fields but instead merges the
// types. Using Omit failed as well. Using a manual copy for now.

// react-hook-form-compatible version of GetMessagesParams
type GetMessagesParamsSearchForm = {
  // These fields are transformed for RHF since it doesn't support flat arrays.
  // In addition, label is used to resolve id/value to name/title. This has
  // nothing to do with RHF but it is convenient to use the structure required
  // by RHF for that purpose as well.
  from_user_ids?: { label: string | undefined; value: number | undefined }[];
  chat_ids?: { label: string | undefined | null; value: number | undefined }[];
  tags?: { value: string | undefined }[];
  chat_tags?: { value: string | undefined }[];

  // These fields are copied from GetMessagesParams.
  // Make sure to update them if GetMessagesParams changes.
  search_type?: MessageSearchType;
  search_query?: string | null;
  saved_search_id?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  is_empty?: boolean | null;
  attachment_type?: MessageAttachmentType | null;
  sort_by?: MessageSortBy | null;
  order?: OrderEnum | null;
  include?: string[] | null;
  exclude?: string[] | null;
  skip?: number;
  limit?: number;
};

type GetChatsParamsSearchForm = {
  // These fields are transformed for RHF since it doesn't support flat arrays.
  tags?: { value: string | undefined }[];

  // These fields are copied from GetChatsParams.
  // Make sure to update them if GetChatsParams changes.
  aggregations?: boolean | null;
  type?: ChatType | null;
  is_verified?: boolean | null;
  is_restricted?: boolean | null;
  is_scam?: boolean | null;
  is_fake?: boolean | null;
  search_query?: string | null;
  sort_by?: ChatSortBy | null;
  order?: OrderEnum | null;
  include?: string[] | null;
  exclude?: string[] | null;
  skip?: number;
  limit?: number;
};

export type SearchFormInputs = {
  chats: GetChatsParamsSearchForm;
  messages: GetMessagesParamsSearchForm;
  users: GetUsersParams;
};
