import {
  AWSCredentials,
  AuthSession,
} from "@aws-amplify/core/dist/esm/singleton/Auth/types";
import { useAttachedPolicies } from "./useAttachedPolicies";
import { useEffect, useState } from "react";
import { Policy } from "@aws-sdk/client-iot";
import { attachPolicyAsync } from "./iotClient";
// import { Button } from "../../components/button/Button";

// TODO: remove?!?
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
      <button className="btn" onClick={handleAdd}>
        Add policy {requiredPolicy}
      </button>
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

export const Policies = ({
  credentials,
  identityId,
  requiredPolicy,
}: {
  credentials: AWSCredentials;
  identityId: string;
  requiredPolicy?: string;
}) => {
  // const { data: fetchedPolicies, isLoading: policiesLoading } =
  //   useAttachedPolicies(credentials, identityId);
  const state = useAttachedPolicies(credentials, identityId);
  const [policies, setPolicies] = useState<Policy[]>();
  useEffect(() => {
    if (!state.isLoading && !state.hasError) {
      setPolicies(state.data);
    }
  }, [state]);

  const handleAdd = (attachedPolicy: Policy) => {
    setPolicies((prev) => {
      const next = prev || [];
      return [...next, attachedPolicy];
    });
  };

  if (state.isLoading) {
    return <div>Loading...</div>;
  }
  if (state.hasError) {
    return <div>{state.errorMessage}</div>;
  }

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

const EnsureRequiredPolicy2 = ({
  policies,
  requiredPolicy,
  // onAdd,
  credentials,
  identityId,
}: {
  policies: Policy[];
  requiredPolicy: string;
  // onAdd: (attachedPolicy: Policy) => void;
  credentials: AWSCredentials;
  identityId: string;
}) => {
  const found = policies.find((p) => p.policyName === requiredPolicy);
  const [existingPolicy, setExistingPolicy] = useState<Policy | undefined>(
    found
  );

  const handleAdd = async () => {
    const attached = await attachPolicyAsync(
      {
        credentials: credentials,
        identityId: identityId,
      },
      requiredPolicy
    );
    //   onAdd(attached);
    setExistingPolicy(attached);
  };

  if (existingPolicy) {
    return (
      <div role="alert" className="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>Great! You have the required policy {requiredPolicy}.</span>
      </div>
    );
  }

  // if (found) {
  //     return <div>Great! You already have required policy {requiredPolicy}.</div>;
  //   }

  return (
    <div role="alert" className="alert alert-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-current shrink-0 w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span>You are missing required policy {requiredPolicy}</span>
      <div>
        <button className="btn btn-sm btn-neutral" onClick={handleAdd}>
          Add policy
        </button>
      </div>
    </div>
  );
};

export const PolicyStatus = ({
  credentials,
  identityId,
  requiredPolicy,
}: {
  credentials: AWSCredentials;
  identityId: string;
  requiredPolicy: string;
}) => {
  const state = useAttachedPolicies(credentials, identityId);
  //   const [policies, setPolicies] = useState<Policy[]>([]);
  //   useEffect(() => {
  //     if (!state.isLoading && !state.hasError) {
  //       setPolicies(state.data);
  //     }
  //   }, [state]);

  //   const handleAdd = (attachedPolicy: Policy) => {
  //     setPolicies((prev) => {
  //       const next = prev || [];
  //       return [...next, attachedPolicy];
  //     });
  //   };
  if (state.isLoading) {
    return <div>Loading...</div>;
  }
  if (state.hasError) {
    return <div>{state.errorMessage}</div>;
  }
  return (
    <EnsureRequiredPolicy2
      policies={state.data}
      requiredPolicy={requiredPolicy}
      credentials={credentials}
      identityId={identityId}
    />
  );
  //   return (
  //     <div role="alert" className="alert alert-info">
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         fill="none"
  //         viewBox="0 0 24 24"
  //         className="stroke-current shrink-0 w-6 h-6"
  //       >
  //         <path
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           strokeWidth="2"
  //           d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  //         ></path>
  //       </svg>
  //       <span>New software update available.</span>
  //     </div>
  //   );
};
