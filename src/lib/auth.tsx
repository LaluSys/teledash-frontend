import { configureAuth } from "react-query-auth";

import { getCurrentAccount } from "features/accounts";
import {
  LoginInput,
  loginWithEmailAndPassword,
  RegisterInput,
  registerWithEmailAndPassword,
} from "features/auth";
import { axios } from "lib/axios";
import storage from "utils/storage";

async function getUser() {
  if (storage.getToken()) {
    const data = await getCurrentAccount();
    return data;
  }
  return null;
}

async function login(data: LoginInput) {
  const { access_token } = await loginWithEmailAndPassword(data);
  storage.setToken(access_token);
  const user = await getUser();
  return user;
}

async function register(data: RegisterInput) {
  registerWithEmailAndPassword(data);
  // react-query-auth will try to log in the user immediately if we return the
  // user here.
  return null;
}

// TODO: We could process the response headers
async function logout() {
  storage.clearToken();
  window.location.assign(window.location.origin);
  return axios.post("/auth/jwt/logout");
}

const authConfig = {
  userFn: getUser,
  loginFn: login,
  registerFn: register,
  logoutFn: logout,
};

export const { useUser, useLogin, useRegister, useLogout, AuthLoader } =
  configureAuth(authConfig);
