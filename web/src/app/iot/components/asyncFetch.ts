import { useEffect, useState } from "react";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

export type ApiReturn<T> =
  | {
      isLoading: true;
      // errorMessage?: undefined;
      // data?: undefined;
    }
  | {
      isLoading: false;
      hasError: false;
      // errorMessage?: undefined;
      data: T;
    }
  | {
      isLoading: false;
      hasError: true;
      errorMessage: string;
      // data?: null;
    }
  | never;

export const useAsyncFetch = <T extends object>(
  callback: () => Promise<T>
  // ): { data?: T; isLoading: boolean; errorMessage?: string } => {
): ApiReturn<T> => {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    const doFetch = async () => {
      setIsLoading(true);
      try {
        const callbackData = await callback();
        setData(callbackData);
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };
    doFetch();
  }, []);

  if (isLoading) {
    return {
      isLoading: true,
    };
  }
  if (errorMessage) {
    return {
      isLoading: false,
      errorMessage,
      hasError: true,
    };
  }
  if (data) {
    return {
      isLoading: false,
      data,
      hasError: false,
    };
  }
  throw new Error("This should never happen");
};
