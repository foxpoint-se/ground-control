import { fetchAuthSession } from "aws-amplify/auth";
import { AuthSession } from "@aws-amplify/core/dist/esm/singleton/Auth/types";
import { ApiReturn, useAsyncFetch } from "./asyncFetch";

// export type AuthSessionState = {
//   authSession?: AuthSession;
//   isLoading: boolean;
//   errorMessage?: string;
// };

export type AuthSessionState = ApiReturn<AuthSession>;

export const useAuthSession = (): AuthSessionState => {
  // const {
  //   data: authSession,
  //   isLoading,
  //   errorMessage,
  // } = useAsyncFetch(fetchAuthSession);
  const stuff = useAsyncFetch(fetchAuthSession);
  return stuff;
  // return {
  //   authSession,
  //   isLoading,
  //   errorMessage,
  // };
};

// export const useAuthSession = () => {
//   const [authSession, setAuthSession] = useState<AuthSession>();
//   useEffect(() => {
//     const doGet = async () => {
//       const session = await fetchAuthSession();
//       setAuthSession(session);
//     };
//     doGet();
//   }, []);

//   return authSession;
// };
