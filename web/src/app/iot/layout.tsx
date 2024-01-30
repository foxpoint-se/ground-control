"use client";

import "@aws-amplify/ui-react/styles.css";
import {
  WithAuthenticatorProps,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { Button } from "../components/button/Button";

type LayoutProps = {
  children: React.ReactNode;
};

type LoggedInLayoutProps = WithAuthenticatorProps & LayoutProps;

const LoggedInLayout = ({ children, signOut, user }: LoggedInLayoutProps) => {
  // TODO: maybe only render children if there is a user??
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full p-2 flex justify-end">
        <div className="space-x-2 flex items-center">
          <div>Signed in as {user?.username}</div>
          <Button onClick={signOut}>Sign out</Button>
        </div>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
};

const DecoratedWithAuth = withAuthenticator(LoggedInLayout, {
  hideSignUp: true,
});

export default DecoratedWithAuth;
