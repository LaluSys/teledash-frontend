import {
  mdiCheckboxBlankOutline,
  mdiCheckboxOutline,
  mdiPencil,
  mdiTrashCan,
} from "@mdi/js";
import Icon from "@mdi/react";

import { Button, LoadingState, Table, LoadMoreButton } from "components/Elements";
import {
  DeleteAccount,
  UpdateAccount,
  useListAccounts,
} from "features/accounts";
import { formatDate, parseDate } from "lib/date";

import { Account, ListAccountsParams } from "types";

const defaultQueryParams: ListAccountsParams = {
  limit: 50,
};

interface AccountListProps {
  queryParams?: ListAccountsParams;
}

export function AccountList({ queryParams }: AccountListProps) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useListAccounts({
    params: { ...defaultQueryParams, ...queryParams },
  });

  const hasResults = data && data.pages[0].data.length > 0;

  const deleteAccountButton = (
    open: () => void,
    props?: { disabled?: boolean },
  ) => (
    <Button
      size="sm"
      variant="secondary"
      startIcon={mdiTrashCan}
      className="-mx-3 -my-2"
      onClick={open}
      disabled={props?.disabled}
    >
      <span>Delete</span>
    </Button>
  );

  const editAccountButton = (open: () => void) => (
    <Button
      size="sm"
      variant="secondary"
      startIcon={mdiPencil}
      className="-mx-6 -my-2"
      onClick={open}
    >
      <span>Edit</span>
    </Button>
  );

  return (
    <>
      {status === "pending" ? (
        <LoadingState size="sm" message="Loading accounts…" />
      ) : status === "error" ? (
        <div className="text-red-500">Error: {error?.message}</div>
      ) : hasResults ? (
        <>
          <div className="-mx-4 bg-white shadow sm:mx-0 sm:rounded-lg">
            <Table<Account>
              data={data.pages.flatMap((page) => page.data)}
              columns={[
                {
                  title: "First Name",
                  field: "first_name",
                },
                {
                  title: "Last Name",
                  field: "last_name",
                },
                {
                  title: "Email",
                  field: "email",
                },
                {
                  title: "Active?",
                  field: "is_active",
                  Cell({ entry: { is_active } }) {
                    return (
                      <Icon
                        path={
                          is_active
                            ? mdiCheckboxOutline
                            : mdiCheckboxBlankOutline
                        }
                        size={1}
                      />
                    );
                  },
                },
                {
                  title: "Verified?",
                  field: "is_verified",
                  Cell({ entry: { is_verified } }) {
                    return (
                      <Icon
                        path={
                          is_verified
                            ? mdiCheckboxOutline
                            : mdiCheckboxBlankOutline
                        }
                        size={1}
                      />
                    );
                  },
                },
                {
                  title: "Admin?",
                  field: "is_superuser",
                  Cell({ entry: { is_superuser } }) {
                    return (
                      <Icon
                        path={
                          is_superuser
                            ? mdiCheckboxOutline
                            : mdiCheckboxBlankOutline
                        }
                        size={1}
                      />
                    );
                  },
                },
                {
                  title: "Created At",
                  field: "created_at",
                  Cell({ entry: { created_at } }) {
                    return (
                      <span>
                        {created_at ? formatDate(parseDate(created_at)) : "—"}
                      </span>
                    );
                  },
                },
                {
                  title: "",
                  field: "id",
                  Cell({ entry }) {
                    return (
                      <UpdateAccount
                        account={{ ...entry, id: entry.id }}
                        triggerButton={editAccountButton}
                      />
                    );
                  },
                },
                {
                  title: "",
                  field: "id",
                  Cell({ entry }) {
                    return (
                      <DeleteAccount
                        account={entry}
                        triggerButton={deleteAccountButton}
                      />
                    );
                  },
                },
              ]}
            />
          </div>
          <LoadMoreButton
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={fetchNextPage}
          />
        </>
      ) : (
        <div>No accounts found.</div>
      )}
    </>
  );
}
