import z from "zod";

import { axios } from "lib/axios";

import { BearerResponse } from "types";

export const loginInputSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8, "Enter a password of at least 8 characters."),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export function loginWithEmailAndPassword(
  data: LoginInput,
): Promise<BearerResponse> {
  return axios.post("/auth/jwt/login", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}
