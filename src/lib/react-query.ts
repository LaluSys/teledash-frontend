import {
  QueryClient,
  UseQueryOptions,
  UseMutationOptions,
  DefaultOptions,
  UseInfiniteQueryOptions,
  QueryKey,
  InfiniteData,
} from "@tanstack/react-query";

import { AxiosError } from "lib/axios";

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<
  ReturnType<FnType>
>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  "queryKey" | "queryFn"
>;

export type InfiniteQueryConfig<FetcherFnType extends (...args: any) => any> =
  UseInfiniteQueryOptions<
    Awaited<ReturnType<FetcherFnType>>,
    AxiosError,
    InfiniteData<Awaited<ReturnType<FetcherFnType>>>,
    Awaited<ReturnType<FetcherFnType>>,
    QueryKey,
    { skip: number; limit?: number }
  >;

export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError,
    Parameters<MutationFnType>[0]
  >;
