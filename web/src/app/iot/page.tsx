"use client";

import {
  WithAuthenticatorProps,
  withAuthenticator,
} from "@aws-amplify/ui-react";
// import { Amplify, ResourcesConfig } from "aws-amplify";
// import { Button } from "../components/button/Button";

import { fetchAuthSession, CredentialsAndIdentityId } from "aws-amplify/auth";
import {
  IoT,
  IoTClient,
  ListThingsCommand,
  Policy,
  ThingAttribute,
} from "@aws-sdk/client-iot";
import { PubSub } from "@aws-amplify/pubsub";
import "@aws-amplify/ui-react/styles.css";
import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AWSCredentials,
  AuthSession,
} from "@aws-amplify/core/dist/esm/singleton/Auth/types";
import { useAuthSession } from "./components/useAuthSession";
import { useCurrentAuth } from "./components/authContext";
import { Policies, PolicyStatus } from "./components/Policies";
import { useThings } from "./components/useThings";
// import {AuthSession,} from '@aws-sdk/types'

// TODO: uninstall aws-amplify???!?!
// No, probably not. could not import from @aws-amplify
// But need to sort out which libs to use
// getCurrentUser comes from @aws-amplify/auth though...

// const amplifyConfig: ResourcesConfig = {
//   Auth: {
//     Cognito: {
//       identityPoolId: "eu-west-1:ece2fbc4-70d8-415c-8571-ead41a44710a",
//       allowGuestAccess: false,
//       userPoolClientId: "1n5adoav28k0g21sntbt6i7h1o",
//       userPoolId: "eu-west-1_aPJcXPBsl",
//       userAttributes: { email_verified: { required: false } },
//     },
//   },
// };

// Amplify.configure(amplifyConfig);

const LastMessage = ({ lastMessage }: { lastMessage: string }) => {
  return (
    <div className="p-2">
      <h1>Welcome!</h1>
      <p>More features coming soon, hopefully.</p>
      <h2 className="mt-4">Last message</h2>
      <p>{lastMessage}</p>
    </div>
  );
};

// type AWSCredentials = {
//   accessKeyId: string;
//   secretAccessKey: string;
//   sessionToken?: string;
//   expiration?: Date;
// };

// type AuthTokens = {
//   idToken?: JWT;
//   accessToken: JWT;
// };

// type AuthSession = {
//   tokens?: AuthTokens;
//   credentials?: AWSCredentials;
//   identityId?: string;
//   userSub?: string;
// };

// const attachPolicy = async (authSession: AuthSession) => {
//   const resp = await attachPolicyAsync({
//     credentials: authSession.credentials,
//     identityId: authSession.identityId,
//   });

// }

// const useEnsurePolicyAttached = (authSession: AuthSession) => {
//   useEffect(() => {
//     const ensurePolicyAttached = async () => {
//       // const authSession = await fetchAuthSession();
//       if (authSession.credentials) {
//         await attachPolicyAsync({
//           credentials: authSession.credentials,
//           identityId: authSession.identityId,
//         });
//         console.log(
//           "Successfully attached policy to user. You should be good to go!"
//         );
//       } else {
//         console.warn(
//           "Could not complete attaching policy. Credentials missing in auth session."
//         );
//       }
//     };
//     ensurePolicyAttached();
//   }, []);

//   return null;
// };

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

function useSubscribeToTopic<Type>(
  topic: string,
  pubsub: PubSub
): Type | undefined {
  const [data, setData] = useState<Type>();

  useEffect(() => {
    const subscription = pubsub.subscribe({ topics: [topic] }).subscribe({
      next: (receivedData) => {
        const newData = receivedData as Type;
        setData(newData);
        console.log(newData);
      },
      error: (err) => {
        console.log("err", err);
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return data;
}

// const useSubscribeToTopic2 = (topic: string, pubsub: PubSub): Message | undefined => {
//   const [message, setMessage] = useState<Message>();
//   useEffect(() => {
//     const pubsub = new PubSub({
//       region: "eu-west-1",
//       endpoint: "wss://a3c7yl7o7rq6cp-ats.iot.eu-west-1.amazonaws.com/mqtt",
//     });
//     const subscription = pubsub.subscribe({ topics: ["messages"] }).subscribe({
//       next: (data) => {
//         const newMessage = data as Message;
//         setMessage(newMessage);
//         console.log(data);
//       },
//       error: (err) => {
//         console.log("err", err);
//       },
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []);
//   return message;
// };

// {
//   "battery": 88.64,
//   "velocity": 3.32
// }

type MockTelemetry = {
  battery: number;
  velocity: number;
};

const LoggedInPage2 = ({ signOut, user }: WithAuthenticatorProps) => {
  // const iotClient = useIotClient()

  // new IoT({
  //   region: "eu-west-1",
  //   endpoint: "https://iot.eu-west-1.amazonaws.com",
  //   credentials: credentialsAndIdentityId.credentials,
  // });
  const authSession = useAuthSession();
  // useEnsurePolicyAttached(authSession);
  const pubsub = new PubSub({
    region: "eu-west-1",
    endpoint: "wss://a3c7yl7o7rq6cp-ats.iot.eu-west-1.amazonaws.com/mqtt",
  });
  // const message = useSubscribeToMessagesTopic();
  const telemetryData = useSubscribeToTopic<MockTelemetry>(
    "ros2_mock_telemetry_topic",
    pubsub
  );
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full p-2 flex justify-end">
        <div className="space-x-2 flex items-center">
          <div>Signed in as {user?.username}</div>

          <button className="btn" onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
      <div className="grow">
        <LastMessage
          lastMessage={
            telemetryData ? JSON.stringify(telemetryData) : "(no message yet)"
          }
        />
      </div>
    </div>
  );
};

// const useThings = (iotClient: IoTClient): ThingAttribute[] | undefined => {
//   const [things, setThings] = useState<ThingAttribute[]>();
//   useEffect(() => {
//     const doGet = async () => {
//       const command = new ListThingsCommand({});
//       const response = await iotClient.send(command);
//       setThings(response.things);
//     };
//     doGet();
//   }, []);
//   return things;
// };

const ThingsList = ({
  credentials,
  identityId,
}: {
  credentials: AWSCredentials;
  identityId: string;
}) => {
  const things = useThings(credentials, identityId);

  if (things.isLoading) {
    return <div>Loading...</div>;
  }

  if (things.hasError) {
    return <div>{things.errorMessage}</div>;
  }

  return <ThingsTable things={things.data} />;
};

const ThingsTable = ({ things }: { things: ThingAttribute[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {things.map((t) => (
            <tr key={t.thingArn}>
              {t.thingName ? (
                <>
                  <td>{t.thingName}</td>
                  <th className="text-right">
                    <Link
                      className="btn btn-sm btn-primary"
                      href={`/iot/things/${t.thingName}`}
                    >
                      Go to thing
                    </Link>
                  </th>
                </>
              ) : (
                <>
                  <td>[unknown thing]</td>
                  <th></th>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = ({
  authSession,
  userName,
}: {
  authSession: AuthSession;
  userName: string;
}) => {
  // useEnsurePolicyAttached(authSession);

  // const iotClient = new IoT({
  //   region: "eu-west-1",
  //   endpoint: "https://iot.eu-west-1.amazonaws.com",
  //   // credentials: credentialsAndIdentityId.credentials,
  //   credentials: authSession.credentials,
  // });

  // const client = new IoTClient({end})

  return (
    <Main>
      <h1 className="text-5xl font-bold mb-md">Welcome {userName}!</h1>
      {authSession.credentials && authSession.identityId && (
        <div className="mb-lg">
          <PolicyStatus
            credentials={authSession.credentials}
            identityId={authSession.identityId}
            requiredPolicy="IotFullAccessPolicy"
          />
        </div>
      )}
      {/* <div className="mt-md  flex justify-end">
        <Link className="btn" href="/iot/policies">
          Go to my policies
        </Link>
      </div> */}
      {/* {authSession.credentials && authSession.identityId && (
        <Policies
          credentials={authSession.credentials}
          identityId={authSession.identityId}
          requiredPolicy="IotFullAccessPolicy"
        />
      )} */}
      {/* <Link href="/iot/policies">My policies</Link> */}
      <h2 className="text-2xl font-bold mb-lg">My things</h2>
      {authSession.credentials && authSession.identityId && (
        <ThingsList
          credentials={authSession.credentials}
          identityId={authSession.identityId}
        />
      )}
      {/* <div className="my-md flex justify-end">
        <Link className="btn" href="/iot/policies">
          Go to my things
        </Link>
      </div> */}
      {/* {things && <ThingsList things={things} />} */}
    </Main>
  );
};

// TODO: maybe rename page to /iot
// TODO: warning if policy is not there
// TODO: link to /policies if warning

const Page = () => {
  const currentAuth = useCurrentAuth();

  // const iotClient = useIotClient()
  // const authSession = useAuthSession();
  // if (!authSession) {
  //   return <div>Not much to show :sad_face:</div>;
  // }
  // if (currentAuth.authSessionState.isLoading || currentAuth.authSessionState.errorMessage !== undefined) {
  if (
    currentAuth.authSessionState.isLoading ||
    currentAuth.authenticatorState.isLoading
  ) {
    return <Main>Loading...</Main>;
  }

  if (currentAuth.authSessionState.hasError) {
    return <Main>{currentAuth.authSessionState.errorMessage}</Main>;
  }
  if (currentAuth.authenticatorState.hasError) {
    return <Main>{currentAuth.authenticatorState.errorMessage}</Main>;
  }
  // }
  currentAuth.authenticatorState;

  return (
    <Main>
      <Dashboard
        authSession={currentAuth.authSessionState.data}
        userName={currentAuth.authenticatorState.data.user.username}
      />
    </Main>
  );
};

const Main = ({ children }: { children: ReactNode }) => {
  return <main className="px-md max-w-3xl mx-auto">{children}</main>;
};

const useIotClient = ({
  credentials,
}: {
  credentials: AWSCredentials;
}): IoT | undefined => {
  const iotRef = useRef<IoT>();

  return iotRef.current;
};

export default Page;

// const DecoratedWithAuth = withAuthenticator(MqttDashboard, {
//   hideSignUp: true,
// });

// export default DecoratedWithAuth;
