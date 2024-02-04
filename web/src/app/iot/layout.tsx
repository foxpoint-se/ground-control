"use client";

import "@aws-amplify/ui-react/styles.css";
import {
  WithAuthenticatorProps,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { AuthUser } from "aws-amplify/auth";
import { SignOut } from "@aws-amplify/ui-react/dist/types/components/Authenticator/Authenticator";
import { Amplify, ResourcesConfig } from "aws-amplify";

import { useAuthSession } from "./components/useAuthSession";
import {
  AmplifyAuthContext,
  AmplifyAuthState,
  AuthSessionContext,
} from "./components/authContext";

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

const useAmplifyAuthState = (
  signOut?: SignOut,
  user?: AuthUser
): AmplifyAuthState => {
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

// TODO: uninstall aws-amplify???!?!
// No, probably not. could not import from @aws-amplify
// But need to sort out which libs to use
// getCurrentUser comes from @aws-amplify/auth though...

const LoggedInLayout = ({ children, signOut, user }: LoggedInLayoutProps) => {
  const amplifyAuthState = useAmplifyAuthState(signOut, user);
  const authSessionState = useAuthSession();

  // TODO: maybe don't use decorator and instead have a logged out state and a login button?
  // have a look at this one: https://gist.github.com/groundedsage/995dc2e14845980fdc547c8ba510169c
  return (
    <AmplifyAuthContext.Provider value={amplifyAuthState}>
      <AuthSessionContext.Provider value={authSessionState}>
        {children}
      </AuthSessionContext.Provider>
    </AmplifyAuthContext.Provider>
  );
};

const DecoratedWithAuth = withAuthenticator(LoggedInLayout, {
  hideSignUp: true,
});

export default DecoratedWithAuth;
