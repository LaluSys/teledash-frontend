import { startCase } from "lodash";
import { Fragment } from "react";

import {
  Badge,
  LoadingState,
  LoadMoreButton,
  ResultsCount,
} from "components/Elements";
import { UserSortSelector } from "features/users";
import { createUserBadgesArray, UserLink, useUsers } from "..";

import { GetUsersParams, OrderEnum, User, UserSortBy } from "types";

const UserListItem = (props: User) => {
  const badgesArray = createUserBadgesArray(props);

  return (
    <li>
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="flex w-full flex-col space-y-1.5 lg:grid lg:grid-cols-8 lg:gap-4 lg:space-y-0 xl:gap-6">
          <div className="lg:col-span-5 lg:flex lg:items-center lg:space-x-2 xl:lg:col-span-6">
            <div>
              <UserLink user={props} className="truncate font-medium" />
            </div>
            {badgesArray.length > 0 && (
              <div className="mt-1.5 flex items-center space-x-2 whitespace-nowrap lg:mt-0">
                {badgesArray.map(({ label, variant }) => (
                  <Badge
                    key={label}
                    label={startCase(label)}
                    variant={variant}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center lg:col-span-2 xl:lg:col-span-1">
            {/* {props.members_count && (
              <div
                className="flex items-center space-x-1"
                title={`${props.members_count} members`}
              >
                <Icon
                  path={mdiAccountMultiple}
                  size={1}
                  className="text-gray-500"
                />
                <span className="font-medium">
                  {new Intl.NumberFormat("en-GB").format(props.members_count)}
                </span>
              </div>
            )} */}
          </div>
          <div className="flex items-center justify-end">
            {/* <Button size="xs" startIcon={mdiPin} variant="secondary">
              Pin
            </Button> */}
            {/* <button
              type="button"
              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Icon path={mdiPin} size={0.6} />
            </button> */}
          </div>
        </div>
      </div>
    </li>
  );
};

const defaultQueryParams: GetUsersParams = {
  limit: 50,
  exclude: [
    "is_self",
    "is_contact",
    "is_mutual_contact",
    "status",
    "last_online_date",
    "next_offline_date",
    "language_code",
    "dc_id",
    "photo",
    "updated_at",
    "scraped_by",
  ],
};

type UserListProps = {
  queryParams?: GetUsersParams;
  onUpdateSort: (sortBy: UserSortBy, order: OrderEnum) => void;
};

export const UserList = ({ queryParams, onUpdateSort }: UserListProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useUsers({
    params: { ...defaultQueryParams, ...queryParams },
  });

  const hasResults = data && data.pages[0].data.length > 0;

  return (
    <>
      {status === "pending" ? (
        <LoadingState size="sm" message="Loading users…" />
      ) : status === "error" ? (
        <div className="text-red-500">Error: {error?.message}</div>
      ) : hasResults ? (
        <div className="space-y-2">
          <div className="flex w-full items-center justify-end space-x-4">
            {data.pages[0].count_total != null && (
              <ResultsCount count={data.pages[0].count_total} />
            )}
            <UserSortSelector
              currentSort={{
                ...data.pages[0].sort,
                sortBy: data.pages[0].sort.sort_by,
              }}
              onUpdateSort={onUpdateSort}
              ignoreSortByOptions={
                queryParams?.search_query ? undefined : ["score"]
              }
            />
          </div>
          <div className="-mx-4 bg-white shadow sm:mx-0 sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {data.pages.map((page, index) => (
                <Fragment key={index}>
                  {page.data.map((user) => (
                    <UserListItem key={user.id} {...user} />
                  ))}
                </Fragment>
              ))}
            </ul>

            <LoadMoreButton
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onLoadMore={fetchNextPage}
            />
          </div>
        </div>
      ) : (
        <div>No users found. </div>
      )}
    </>
  );
};

/*

_id?: number;
username?: string;
first_name?: string;
last_name?: string;
is_deleted?: boolean;
is_bot?: boolean;
is_verified?: boolean;
is_restricted?: boolean;
is_scam?: boolean;
is_fake?: boolean;
is_support?: boolean;
phone_number?: string;
restrictions?: { [key: string]: unknown }[];

is_self?: boolean;
is_contact?: boolean;
is_mutual_contact?: boolean;
status?: string;
last_online_date?: string;
next_offline_date?: string;
language_code?: string;
dc_id?: number;
photo?: { [key: string]: unknown };
updated_at?: string;
scraped_by?: string;
*/
