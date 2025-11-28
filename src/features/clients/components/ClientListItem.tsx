import { mdiPhone, mdiSync, mdiSyncOff } from "@mdi/js";
import Icon from "@mdi/react";

import { DeleteClient, EditClient } from "features/clients";

import { ClientOut } from "types";

export function ClientListItem(client: ClientOut) {
  return (
    <li className="flex w-full items-center gap-4 space-y-0 px-4 py-2 sm:px-6 sm:first:rounded-t-lg sm:last:rounded-b-lg">
      <div className="flex flex-grow truncate">
        <span className="truncate font-medium">{client.title}</span>
      </div>
      {client.phone_number && (
        <div
          className="flex items-center text-gray-500"
          title={"+" + client.phone_number}
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
      <EditClient client={client} />
      <DeleteClient client={client} />
    </li>
  );
}
