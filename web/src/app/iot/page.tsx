"use client";

import {
  WithAuthenticatorProps,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { Amplify, ResourcesConfig } from "aws-amplify";
import { Button } from "../components/button/Button";

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
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AWSCredentials,
  AuthSession,
} from "@aws-amplify/core/dist/esm/singleton/Auth/types";
// import {AuthSession,} from '@aws-sdk/types'

// TODO: uninstall aws-amplify???!?!
// No, probably not. could not import from @aws-amplify
// But need to sort out which libs to use
// getCurrentUser comes from @aws-amplify/auth though...

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

const useAuthSession = () => {
  const [authSession, setAuthSession] = useState<AuthSession>();
  useEffect(() => {
    const doGet = async () => {
      const session = await fetchAuthSession();
      setAuthSession(session);
    };
    doGet();
  }, []);

  return authSession;
};

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
const useAttachedPolicies = (
  // authSession: AuthSession,
  credentials: AWSCredentials,
  identityId: string
): { data?: Policy[]; isLoading: boolean; error?: string } => {
  const [data, setData] = useState<Policy[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  useEffect(() => {
    const loadPolicies = async () => {
      setIsLoading(true);
      const attachedPolicies = await getAttachedPolicies({
        credentials: credentials,
        identityId: identityId,
      });
      setIsLoading(false);
      setData(attachedPolicies);
    };
    loadPolicies();
  }, []);

  return {
    data,
    isLoading,
    error,
  };
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

          <Button onClick={signOut}>Sign out</Button>
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

const useThings = (iotClient: IoTClient): ThingAttribute[] | undefined => {
  const [things, setThings] = useState<ThingAttribute[]>();
  useEffect(() => {
    const doGet = async () => {
      const command = new ListThingsCommand({});
      const response = await iotClient.send(command);
      setThings(response.things);
    };
    doGet();
  }, []);
  return things;
};

const ThingsList = ({ things }: { things: ThingAttribute[] }) => {
  return (
    <div>
      {things.map((t) => (
        <div key={t.thingArn}>
          {t.thingName ? (
            <Link href={`/iot/things/${t.thingName}`}>{t.thingName}</Link>
          ) : (
            <div>unknown thing :(</div>
          )}
        </div>
      ))}
    </div>
  );
};

const Dashboard = ({ authSession }: { authSession: AuthSession }) => {
  // useEnsurePolicyAttached(authSession);

  // const iotClient = new IoT({
  //   region: "eu-west-1",
  //   endpoint: "https://iot.eu-west-1.amazonaws.com",
  //   // credentials: credentialsAndIdentityId.credentials,
  //   credentials: authSession.credentials,
  // });

  // const client = new IoTClient({end})

  // const things = useThings(iotClient);

  return (
    <div>
      <h1>Nu har vi session va</h1>
      {authSession.credentials && authSession.identityId && (
        <Policies
          credentials={authSession.credentials}
          identityId={authSession.identityId}
          requiredPolicy="IotFullAccessPolicy"
        />
      )}
      <Link href="/iot/things">Gå till lista över things</Link>
      {/* {things && <ThingsList things={things} />} */}
    </div>
  );
};

const PolicyList = ({ policies }: { policies: Policy[] }) => {
  if (policies.length === 0) {
    return <div>No policies</div>;
  }
  return (
    <ul>
      {policies.map((p) => (
        <li key={p.policyName}>{p.policyName}</li>
      ))}
    </ul>
  );
};

const EnsureRequiredPolicy = ({
  policies,
  requiredPolicy,
  onAdd,
  credentials,
  identityId,
}: {
  policies: Policy[];
  requiredPolicy: string;
  onAdd: (attachedPolicy: Policy) => void;
  credentials: AWSCredentials;
  identityId: string;
}) => {
  const found = policies.find((p) => p.policyName === requiredPolicy);
  if (found) {
    return <div>Great! You already have required policy {requiredPolicy}.</div>;
  }

  const handleAdd = async () => {
    const attached = await attachPolicyAsync(
      {
        credentials: credentials,
        identityId: identityId,
      },
      requiredPolicy
    );
    onAdd(attached);
  };

  return (
    <div>
      <div>You are missing required policy {requiredPolicy}</div>
      <Button onClick={handleAdd}>Add policy {requiredPolicy}</Button>
    </div>
  );
};

const Policies = ({
  credentials,
  identityId,
  requiredPolicy,
}: {
  credentials: AWSCredentials;
  identityId: string;
  requiredPolicy?: string;
}) => {
  const { data: fetchedPolicies, isLoading: policiesLoading } =
    useAttachedPolicies(credentials, identityId);
  const [policies, setPolicies] = useState<Policy[]>();
  useEffect(() => {
    setPolicies(fetchedPolicies);
  }, [fetchedPolicies]);

  const handleAdd = (attachedPolicy: Policy) => {
    setPolicies((prev) => {
      const next = prev || [];
      return [...next, attachedPolicy];
    });
  };
  return (
    <div>
      <h2>Policies attached to me</h2>
      {policies && (
        <>
          <PolicyList policies={policies} />
          {requiredPolicy && (
            <EnsureRequiredPolicy
              policies={policies}
              requiredPolicy={requiredPolicy}
              onAdd={handleAdd}
              credentials={credentials}
              identityId={identityId}
            />
          )}
        </>
      )}
    </div>
  );
};

// TODO: maybe rename page to /iot
// TODO: warning if policy is not there
// TODO: link to /policies if warning

const Page = () => {
  // const iotClient = useIotClient()
  const authSession = useAuthSession();
  if (!authSession) {
    return <div>Not much to show :sad_face:</div>;
  }

  return (
    <div>
      <Dashboard authSession={authSession} />
    </div>
  );
};

const useIotClient = ({
  credentials,
}: {
  credentials: AWSCredentials;
}): IoT | undefined => {
  const iotRef = useRef<IoT>();

  return iotRef.current;
};

let commonIotClient: IoT;

const getIotClient = (credentials: AWSCredentials): IoT => {
  if (!commonIotClient) {
    commonIotClient = new IoT({
      region: "eu-west-1",
      endpoint: "https://iot.eu-west-1.amazonaws.com",
      credentials: credentials,
    });
  }
  return commonIotClient;
};

const getAttachedPolicies = async (
  credentialsAndIdentityId: CredentialsAndIdentityId
): Promise<Policy[]> => {
  const iotClient = getIotClient(credentialsAndIdentityId.credentials);
  const resp = await iotClient.listPrincipalPolicies({
    principal: credentialsAndIdentityId.identityId,
  });
  return resp.policies || [];
};

const attachPolicyAsync = async (
  credentialsAndIdentityId: CredentialsAndIdentityId,
  policyName: string
): Promise<Policy> => {
  // const iot = new IoT({
  //   region: "eu-west-1",
  //   endpoint: "https://iot.eu-west-1.amazonaws.com",
  //   credentials: credentialsAndIdentityId.credentials,
  // });
  const iotClient = getIotClient(credentialsAndIdentityId.credentials);
  // iot.listPrincipalPolicies({principal: credentialsAndIdentityId.identityId})
  await iotClient.attachPolicy({
    policyName,
    target: credentialsAndIdentityId.identityId,
  });
  const all = await iotClient.listPrincipalPolicies({
    principal: credentialsAndIdentityId.identityId,
  });
  if (all.policies) {
    const found = all.policies.find((p) => p.policyName === policyName);
    if (found) {
      return found;
    }
  }
  throw new Error("Failed attaching policy for some reason");
};

export default Page;

// const DecoratedWithAuth = withAuthenticator(MqttDashboard, {
//   hideSignUp: true,
// });

// export default DecoratedWithAuth;
