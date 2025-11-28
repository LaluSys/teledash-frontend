import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { formatNumber } from "utils/formatNumber";

import { SavedSearchesMessagesCountDict } from "types";

export async function countUnreadMessages(): Promise<SavedSearchesMessagesCountDict> {
  return axios.get("/saved-searches/count-unread-messages");
}

export function useCountUnreadMessages() {
  return useQuery({
    queryKey: ["saved-searches-count"],
    queryFn: countUnreadMessages,
    refetchInterval: 600000, // 10 minutes
  });
}

export function useCountTotalUnreadMessages() {
  const { data: messagesCountDict } = useCountUnreadMessages();

  const totalUnreadMessagesCount = Object.values(
    messagesCountDict ?? {},
  ).reduce((n, { count_unread }) => n + count_unread, 0);

  return formatNumber(totalUnreadMessagesCount);
}
