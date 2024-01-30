"use client";

import "@aws-amplify/ui-react/styles.css";
import {
  WithAuthenticatorProps,
  withAuthenticator,
} from "@aws-amplify/ui-react";
// import { Button } from "../components/button/Button";
import { AuthUser } from "aws-amplify/auth";
import { SignOut } from "@aws-amplify/ui-react/dist/types/components/Authenticator/Authenticator";
import { Amplify, ResourcesConfig } from "aws-amplify";

import { useAuthSession } from "./components/useAuthSession";
import { AuthContext, AuthenticatorState } from "./components/authContext";

const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      identityPoolId: "eu-west-1:ece2fbc4-70d8-415c-8571-ead41a44710a",
      allowGuestAccess: false,
      userPoolClientId: "1n5adoav28k0g21sntbt6i7h1o",
      userPoolId: "eu-west-1_aPJcXPBsl",
      userAttributes: { email_verified: { required: false } },
    },
  },
};

Amplify.configure(amplifyConfig);

type LayoutProps = {
  children: React.ReactNode;
};

type LoggedInLayoutProps = WithAuthenticatorProps & LayoutProps;

const useAuthenticatorState = (
  signOut?: SignOut,
  user?: AuthUser
): AuthenticatorState => {
  if (!user || !signOut) {
    return {
      isLoading: true,
    };
  }
  return {
    data: {
      signOut,
      user,
    },
    hasError: false,
    isLoading: false,
  };
};

const LoggedInLayout = ({ children, signOut, user }: LoggedInLayoutProps) => {
  const authSessionState = useAuthSession();
  const authenticatorState = useAuthenticatorState(signOut, user);

  // TODO: maybe don't use decorator and instead have a logged out state and a login button?
  return (
    <AuthContext.Provider value={{ authenticatorState, authSessionState }}>
      <div className="min-h-screen flex flex-col">
        <div className="w-full p-2 flex justify-end">
          <div className="space-x-2 flex items-center">
            <div>Signed in as {user?.username}</div>
            <button className="btn btn-sm" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
        <div className="grow">{children}</div>
      </div>
    </AuthContext.Provider>
  );
};

const DecoratedWithAuth = withAuthenticator(LoggedInLayout, {
  hideSignUp: true,
});

export default DecoratedWithAuth;
