import {
  AWSCredentials,
  AuthSession,
} from "@aws-amplify/core/dist/esm/singleton/Auth/types";
import { Policy } from "@aws-sdk/client-iot";
import { getAttachedPolicies } from "./iotClient";
import { ApiReturn, useAsyncFetch } from "./asyncFetch";

type AttachedPoliciesState = ApiReturn<Policy[]>;

export const useAttachedPolicies = (
  // authSession: AuthSession,
  credentials: AWSCredentials,
  identityId: string
  //   ): { data?: Policy[]; isLoading: boolean; error?: string } => {
): AttachedPoliciesState => {
  // const [data, setData] = useState<Policy[]>();
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string>();

  const callback = async () => {
    const attachedPolicies = await getAttachedPolicies({
      credentials: credentials,
      identityId: identityId,
    });
    return attachedPolicies;
  };

  const stuff = useAsyncFetch(callback);
  return stuff;

  // useEffect(() => {
  //   const loadPolicies = async () => {
  //     setIsLoading(true);
  //     const attachedPolicies = await getAttachedPolicies({
  //       credentials: credentials,
  //       identityId: identityId,
  //     });
  //     setIsLoading(false);
  //     setData(attachedPolicies);
  //   };
  //   loadPolicies();
  // }, []);

  // return {
  //   data,
  //   isLoading,
  //   error,
  // };
};
