import { mdiPhone, mdiSync, mdiSyncOff } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import { useState } from "react";

import { Button, DisclosureDialog, LoadingState, LoadMoreButton } from "components/Elements";
import { useAddChat, useListClients } from "features/clients";

import { useNotificationStore } from "stores/notifications";
import { Client } from "types";

type AddChatClientSelectorProps = {
  chat_id: number;
  onSuccess: () => void;
};

export function AddChatClientSelector({
  onSuccess,
  chat_id,
}: AddChatClientSelectorProps) {
  const { addNotification } = useNotificationStore();
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const addChatMutation = useAddChat({
    mutationConfig: {
      onSuccess: (response) => {
        addNotification({
          type: "success",
          title: response.message,
        });
        onSuccess();
      },
      onError: (error) => {
        // Axios response interceptor does not display notifications for 404 errors, so we need to handle them here.
        if (error.status === 404) {
          addNotification({
            type: "error",
            title: "Failed to add chat.",
            message:
              typeof error.response?.data?.detail === "string"
                ? error.response?.data?.detail
                : // In case of validation errors, FastAPI returns an object with more specific details.
                  // For now we'll just print the object as a string.
                  JSON.stringify(error.response?.data?.detail),
          });
        } else if (error.status === 304) {
          addNotification({
            type: "info",
            title: "Chat is already in the list of channels to be joined.",
          });
          // Close dialog
          onSuccess();
        }
      },
    },
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useListClients();

  const handleAddChat = () => {
    if (selectedClientId) {
      addChatMutation.mutate({
        client_id: selectedClientId,
        data: { chat_id },
      });
    }
  };

  const clients = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Channels need to be associated with a Telegram account.
        <br />
        Please select one of the authenticated accounts below to join this chat.
      </p>
      {status === "pending" ? (
        <LoadingState size="sm" message="Loading accounts…" />
      ) : status === "error" ? (
        <div className="text-center text-red-500">
          Error loading accounts: {error?.message}
        </div>
      ) : clients.length === 0 ? (
        <div className="text-gray 600 text-center">No accounts found.</div>
      ) : (
        <ul className="-mx-4 bg-white shadow sm:mx-0 sm:rounded-lg">
          {clients.map((client: Client, index) => (
            <li
              key={client.id}
              className={clsx(
                "flex gap-4 border",
                "w-full cursor-pointer items-center space-y-0 border py-4 hover:bg-gray-50 sm:px-6 sm:first:rounded-t-lg sm:last:rounded-b-lg",
                index !== 0 && "border-t border-gray-200",
                selectedClientId === client.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-gray-300 text-gray-900",
              )}
              onClick={() => setSelectedClientId(client.id)}
            >
              <div className="flex flex-grow truncate">
                <span className="truncate font-medium">{client.title}</span>
              </div>
              {client.phone_number && (
                <div
                  className="flex items-center text-gray-500"
                  title={
                    "+" +
                    client.phone_number.slice(0, 3) +
                    "..." +
                    client.phone_number.slice(-3)
                  }
                >
                  <Icon path={mdiPhone} size={0.75} />
                  <span className="">
                    {"+" +
                      client.phone_number.slice(0, 3) +
                      "..." +
                      client.phone_number.slice(-3)}
                  </span>
                </div>
              )}
              <div title={client.is_active ? "Active" : "Inactive"}>
                {client.is_active ? (
                  <Icon path={mdiSync} size={1} className="text-green-500" />
                ) : (
                  <Icon path={mdiSyncOff} size={1} className="text-red-300" />
                )}
                <span className="font-medium">{client.is_active}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <LoadMoreButton
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />

      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          onClick={handleAddChat}
          isLoading={addChatMutation.isPending}
          disabled={!selectedClientId || addChatMutation.isPending}
        >
          Add Chat
        </Button>
      </div>
    </div>
  );
}

type AddChatProps = {
  chat_id: number;
};

export function AddChat({ chat_id }: AddChatProps) {
  return (
    <DisclosureDialog
      triggerButton={(open) => (
        <Button size="sm" variant="secondary" onClick={open}>
          Add Chat
        </Button>
      )}
      title={"Add Chat"}
    >
      {({ close }) => (
        <AddChatClientSelector chat_id={chat_id} onSuccess={close} />
      )}
    </DisclosureDialog>
  );
}
