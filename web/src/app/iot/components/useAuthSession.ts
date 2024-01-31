import { fetchAuthSession } from "aws-amplify/auth";
import { AuthSession } from "@aws-amplify/core/dist/esm/singleton/Auth/types";
import { ApiReturn, useAsyncFetch } from "./asyncFetch";

export type AuthSessionState = ApiReturn<AuthSession>;

export const useAuthSession = (): AuthSessionState => {
  const stuff = useAsyncFetch(fetchAuthSession);
  return stuff;
};
