import { AWSCredentials } from "@aws-amplify/core/dist/esm/singleton/Auth/types";
import { useAttachedPolicies } from "./useAttachedPolicies";
import { useState } from "react";
import { Policy } from "@aws-sdk/client-iot";
import { attachPolicyAsync } from "./iotClient";

const EnsureRequiredPolicy = ({
  policies,
  requiredPolicy,
  credentials,
  identityId,
}: {
  policies: Policy[];
  requiredPolicy: string;
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
  if (state.isLoading) {
    return <div>Loading...</div>;
  }
  if (state.hasError) {
    return <div>{state.errorMessage}</div>;
  }
  return (
    <EnsureRequiredPolicy
      policies={state.data}
      requiredPolicy={requiredPolicy}
      credentials={credentials}
      identityId={identityId}
    />
  );
};
