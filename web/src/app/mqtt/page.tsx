"use client";

import {
  WithAuthenticatorProps,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { Button } from "../components/button/Button";
import { fetchAuthSession, CredentialsAndIdentityId } from "aws-amplify/auth";
import { IoT } from "@aws-sdk/client-iot";

import "@aws-amplify/ui-react/styles.css";
import { useEffect } from "react";

Amplify.configure({
  Auth: {
    Cognito: {
      identityPoolId: "eu-west-1:f31d37b9-149d-4010-bbfd-57f79b1cd29a",
      allowGuestAccess: false,
      userPoolClientId: "77u6qa63dbj637gmrmup2kiigh",
      userPoolId: "eu-west-1_pETBFHmLa",
      userAttributes: { email_verified: { required: false } },
    },
  },
});

const Page = () => {
  return (
    <div className="p-2">
      <h1>Welcome!</h1>
      <p>More features coming soon, hopefully.</p>
    </div>
  );
};

const useEnsurePolicyAttached = () => {
  useEffect(() => {
    const ensurePolicyAttached = async () => {
      const authSession = await fetchAuthSession();
      if (authSession.credentials) {
        await attachPolicyAsync({
          credentials: authSession.credentials,
          identityId: authSession.identityId,
        });
        console.log(
          "Successfully attached policy to user. You should be good to go!"
        );
      } else {
        console.warn(
          "Could not complete attaching policy. Credentials missing in auth session."
        );
      }
    };
    ensurePolicyAttached();
  }, []);

  return null;
};

const LoggedInPage = ({ signOut, user }: WithAuthenticatorProps) => {
  useEnsurePolicyAttached();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full p-2 flex justify-end">
        <div className="space-x-2 flex items-center">
          <div>Signed in as {user?.username}</div>

          <Button onClick={signOut}>Sign out</Button>
        </div>
      </div>
      <div className="grow">
        <Page />
      </div>
    </div>
  );
};

const attachPolicyAsync = async (
  credentialsAndIdentityId: CredentialsAndIdentityId,
  policyName: string = "TestFullAccessPolicy"
) => {
  const iot = new IoT({
    region: "eu-west-1",
    endpoint: "https://iot.eu-west-1.amazonaws.com",
    credentials: credentialsAndIdentityId.credentials,
  });
  await iot.attachPolicy({
    policyName,
    target: credentialsAndIdentityId.identityId,
  });
};

const DecoratedWithAuth = withAuthenticator(LoggedInPage, {
  hideSignUp: true,
});

export default DecoratedWithAuth;
