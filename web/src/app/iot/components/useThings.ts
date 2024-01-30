import { AWSCredentials } from "@aws-amplify/core/dist/esm/singleton/Auth/types";
import { ThingAttribute } from "@aws-sdk/client-iot";
import { getThings } from "./iotClient";
import { ApiReturn, useAsyncFetch } from "./asyncFetch";

type ThingsState = ApiReturn<ThingAttribute[]>;

export const useThings = (
  credentials: AWSCredentials,
  identityId: string
): ThingsState => {
  const callback = async () => {
    const attachedPolicies = await getThings({
      credentials: credentials,
      identityId: identityId,
    });
    return attachedPolicies;
  };

  const stuff = useAsyncFetch(callback);
  return stuff;
};
