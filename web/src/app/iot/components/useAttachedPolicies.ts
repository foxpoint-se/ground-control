import { AWSCredentials } from "@aws-amplify/core/dist/esm/singleton/Auth/types";
import { Policy } from "@aws-sdk/client-iot";
import { getAttachedPolicies } from "./iotClient";
import { ApiReturn, useAsyncFetch } from "./asyncFetch";

type AttachedPoliciesState = ApiReturn<Policy[]>;

export const useAttachedPolicies = (
  credentials: AWSCredentials,
  identityId: string
): AttachedPoliciesState => {
  const callback = async () => {
    const attachedPolicies = await getAttachedPolicies({
      credentials: credentials,
      identityId: identityId,
    });
    return attachedPolicies;
  };

  const stuff = useAsyncFetch(callback);
  return stuff;
};
