"use client";

import {
  WithAuthenticatorProps,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { Amplify, ResourcesConfig } from "aws-amplify";
import { Button } from "../components/button/Button";
import { fetchAuthSession, CredentialsAndIdentityId } from "aws-amplify/auth";
import { IoT } from "@aws-sdk/client-iot";
import { PubSub } from "@aws-amplify/pubsub";
import "@aws-amplify/ui-react/styles.css";
import { useEffect, useState } from "react";

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

const Page = ({ lastMessage }: { lastMessage: string }) => {
  return (
    <div className="p-2">
      <h1>Welcome!</h1>
      <p>More features coming soon, hopefully.</p>
      <h2 className="mt-4">Last message</h2>
      <p>{lastMessage}</p>
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

type Message = {
  message: string;
};

const useSubscribeToMessagesTopic = (): Message | undefined => {
  const [message, setMessage] = useState<Message>();
  useEffect(() => {
    const pubsub = new PubSub({
      region: "eu-west-1",
      endpoint: "wss://a3c7yl7o7rq6cp-ats.iot.eu-west-1.amazonaws.com/mqtt",
    });
    const subscription = pubsub.subscribe({ topics: ["messages"] }).subscribe({
      next: (data) => {
        const newMessage = data as Message;
        setMessage(newMessage);
        console.log(data);
      },
      error: (err) => {
        console.log("err", err);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return message;
};

const LoggedInPage = ({ signOut, user }: WithAuthenticatorProps) => {
  useEnsurePolicyAttached();
  const message = useSubscribeToMessagesTopic();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full p-2 flex justify-end">
        <div className="space-x-2 flex items-center">
          <div>Signed in as {user?.username}</div>

          <Button onClick={signOut}>Sign out</Button>
        </div>
      </div>
      <div className="grow">
        <Page lastMessage={message?.message || "(no message yet)"} />
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
