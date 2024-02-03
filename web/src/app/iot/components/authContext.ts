import { createContext, useContext } from "react";
import { AuthUser } from "aws-amplify/auth";
import { SignOut } from "@aws-amplify/ui-react/dist/types/components/Authenticator/Authenticator";
import { AuthSessionState } from "./useAuthSession";
import { ApiReturn } from "./asyncFetch";

export type AmplifyAuthState = ApiReturn<{
  signOut: SignOut;
  user: AuthUser;
}>;

export const AmplifyAuthContext = createContext<AmplifyAuthState>({
  isLoading: true,
});
export const useAmplifyAuth = (): AmplifyAuthState => {
  const currentAmplifyAuth = useContext(AmplifyAuthContext);
  return currentAmplifyAuth;
};

export const AuthSessionContext = createContext<AuthSessionState>({
  isLoading: true,
});
export const useCurrentAuthSession = (): AuthSessionState => {
  const currentAuthSession = useContext(AuthSessionContext);
  return currentAuthSession;
};
