"use client";

import { ThingAttribute } from "@aws-sdk/client-iot";
import "@aws-amplify/ui-react/styles.css";
import { ReactNode } from "react";
import Link from "next/link";
import {
  AWSCredentials,
  AuthSession,
} from "@aws-amplify/core/dist/esm/singleton/Auth/types";
import { PolicyStatus } from "./components/Policies";
import { useThings } from "./components/useThings";
import {
  useAmplifyAuth,
  useCurrentAuthSession,
} from "./components/authContext";

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
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {things.map((t) => (
            <tr key={t.thingArn}>
              {t.thingName ? (
                <>
                  <td>{t.thingName}</td>
                  <th className="text-right">
                    <Link
                      className="btn btn-sm btn-primary"
                      href={`/iot/things?thing=${t.thingName}`}
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
      <h2 className="text-2xl font-bold mb-lg">My things</h2>
      {authSession.credentials && authSession.identityId && (
        <ThingsList
          credentials={authSession.credentials}
          identityId={authSession.identityId}
        />
      )}
    </Main>
  );
};

const Page = () => {
  const amplifyAuth = useAmplifyAuth();
  const currentAuthSession = useCurrentAuthSession();
  if (amplifyAuth.isLoading) {
    return <Main>Loading...</Main>;
  }

  if (amplifyAuth.hasError) {
    return <Main>{amplifyAuth.errorMessage}</Main>;
  }

  return (
    <Main>
      {currentAuthSession.isLoading || currentAuthSession.hasError ? (
        <>
          {currentAuthSession.isLoading ? (
            <div>Auth session loading...</div>
          ) : (
            <div>Something went wrong getting auth session</div>
          )}
        </>
      ) : (
        <Dashboard
          authSession={currentAuthSession.data}
          userName={amplifyAuth.data.user.username}
        />
      )}
    </Main>
  );
};

const Main = ({ children }: { children: ReactNode }) => {
  return <main className="px-md max-w-3xl mx-auto">{children}</main>;
};

export default Page;
