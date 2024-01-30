import {
  WithAuthenticatorProps,
  withAuthenticator,
} from "@aws-amplify/ui-react";

const Page = ({ signOut, user }: WithAuthenticatorProps) => {
  return <h1>Things</h1>;
};
// const DecoratedWithAuth = withAuthenticator(Page, {
//   hideSignUp: true,
// });

export default Page;
