import z from "zod";

import { axios } from "lib/axios";

import { Account } from "types";

export const registerInputSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  password: z.string().min(8, "Enter a password of at least 8 characters."),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const registerWithEmailAndPassword = (
  data: RegisterInput,
): Promise<Account> => {
  return axios.post("/auth/register", data);
};
