import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../utils/config/baseUrl";
import { getDataFromLocalStorage } from "../../utils/localStorage";
import { setIsAuth, logOut } from "../slices/isAuthSlice";

// Define types for the API data
interface User {
  id: string;
  name: string;
  email: string;
}

export interface IResponse {
  status: number;
  message: string;
  data: any;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

interface SendDataRequest {
  url: string;
  data: any;
  type: "POST" | "PUT" | "DELETE" | "PATCH";
}

interface RefreshResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Define a base query with necessary configurations such as base URL and headers
const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = getDataFromLocalStorage("accessToken");
    const email = getDataFromLocalStorage("email");

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
      // headers.set("x-user-email", email);
    }
    return headers;
  },
  credentials: "include",
});

// Custom query function that handles token refreshing logic
const baseQueryWithReauth = async (
  args: any,
  api: any,
  extraOptions: any
): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error &&
    (result.error.status === 403 || result.error.status === 401)
  ) {
    const refreshResult = (await baseQuery(
      "auth/refresh",
      api,
      extraOptions
    )) as { data: RefreshResponse | undefined };
    const accessToken = getDataFromLocalStorage("accessToken");

    if (refreshResult.data && accessToken) {
      // Update the Redux store with the new token
      api.dispatch(
        setIsAuth({
          isAuth: true,
          accessToken: refreshResult.data.accessToken,
          user: refreshResult.data.user,
        })
      );

      // Retry the initial query with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Log out the user if token refresh fails
      api.dispatch(logOut());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "request",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"], // You can define tagTypes here if you need them for cache invalidation
  refetchOnFocus: true,
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getUser: builder.query<IResponse, { id: string | null }>({
      query: ({ id }) => {
        return `users`;
      },
      providesTags: ["Users"],
    }),
    sendData: builder.mutation<any, SendDataRequest>({
      query: ({ url, data, type }) => ({
        url: url,
        method: type,
        body: data,
      }),
      invalidatesTags: () => ["Users"],
      transformResponse: (response: any) => {
        return response;
      },
    }),
  }),
});

export const { useGetUserQuery } = api;
