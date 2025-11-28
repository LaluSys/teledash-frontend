import { axios } from "lib/axios";

import { Account } from "types";

export async function getCurrentAccount(): Promise<Account> {
  return axios.get("/accounts/me");
}
