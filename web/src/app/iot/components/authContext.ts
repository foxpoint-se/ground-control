import { createContext, useContext } from "react";
import { AuthUser } from "aws-amplify/auth";
import { SignOut } from "@aws-amplify/ui-react/dist/types/components/Authenticator/Authenticator";
import { AuthSessionState } from "./useAuthSession";
import { ApiReturn } from "./asyncFetch";

export type AuthenticatorState = ApiReturn<{
  signOut: SignOut;
  user: AuthUser;
}>;

type CurrentAuth = {
  // user?: AuthUser;
  authSessionState: AuthSessionState;
  // signOut?: SignOut;
  authenticatorState: AuthenticatorState;
};

const initialValue: CurrentAuth = {
  authSessionState: {
    isLoading: true,
  },
  authenticatorState: {
    isLoading: true,
  },
};

export const AuthContext = createContext<CurrentAuth>(initialValue);

export const useCurrentAuth = (): CurrentAuth => {
  const currentAuth = useContext(AuthContext);
  return currentAuth;
};
