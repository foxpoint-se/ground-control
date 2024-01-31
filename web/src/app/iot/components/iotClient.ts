import {
  IoT,
  ListThingsCommand,
  Policy,
  ThingAttribute,
} from "@aws-sdk/client-iot";
import { CredentialsAndIdentityId } from "aws-amplify/auth";
import { AWSCredentials } from "@aws-amplify/core/dist/esm/singleton/Auth/types";

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

export const getAttachedPolicies = async (
  credentialsAndIdentityId: CredentialsAndIdentityId
): Promise<Policy[]> => {
  const iotClient = getIotClient(credentialsAndIdentityId.credentials);
  const resp = await iotClient.listPrincipalPolicies({
    principal: credentialsAndIdentityId.identityId,
  });
  return resp.policies || [];
};

export const attachPolicyAsync = async (
  credentialsAndIdentityId: CredentialsAndIdentityId,
  policyName: string
): Promise<Policy> => {
  const iotClient = getIotClient(credentialsAndIdentityId.credentials);
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

export const getThings = async (
  credentialsAndIdentityId: CredentialsAndIdentityId
): Promise<ThingAttribute[]> => {
  const iotClient = getIotClient(credentialsAndIdentityId.credentials);

  const command = new ListThingsCommand({});
  const response = await iotClient.send(command);
  return response.things || [];
};
