import User from "./user/user";
import useSWR from "swr";
import { MutatorOptions, PublicConfiguration } from "swr/_internal";

export type SWRConfig = Partial<PublicConfiguration<unknown, any>> | undefined;
export type MutationOptions = boolean | MutatorOptions<any> | undefined;
class Api {
  API_URL = "http://localhost:8080/api/";

  user = new User();
  fetcher = (route: string, data: RequestInit = {}) => {
    const headers = new Headers();
    headers.append("content-type", "application/json");
    data.headers = headers;
    return fetch(this.API_URL + route, data);
  };

  useSWR = (
    route: string | [],
    fetcher: (args: string) => any,
    config: SWRConfig
  ) => useSWR(route, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...(config || {}),
  })
}

export default new Api();
