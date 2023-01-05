import { mutate, MutatorCallback, MutatorOptions, useSWRConfig } from "swr";
import api, { MutationOptions, SWRConfig } from "../api";

export type UserT = {
  id: number;
  firstName: string;
  lastName: string;
};
class User {
  route = "user/get-user";

  parser = (data: any): UserT => {
    return {
      id: data?.id || 0,
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
    };
  };

  userFetcher = async () => {
    const data = await new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("fetching data");
        resolve({
          firstName: "John Doe",
        });
      }, 1000);
    });
    return this.parser({
      ...(data || {}),
      id: 1,
    });
  };

  useUserCacheOnly = () => this.useUser({ 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    revalidateOnMount: false,
   });

  useUser = (options?: SWRConfig): {
    data: UserT;
    isLoading: boolean;
    isValidating: boolean;
  } => {
    const { data, error, isLoading, isValidating } = api.useSWR(
      this.route,
      this.userFetcher,
      options
    );

    if (error) {
      console.log("Run some error handling");
      return {
        data: this.parser({}),
        isLoading,
        isValidating,
      };
    }
    return {
      data:this.parser(data),
      isLoading,
      isValidating,
    };
  };

  mutate = (
    data: UserT | Promise<UserT> | MutatorCallback<UserT> | undefined,
    options: MutationOptions
  ): Promise<any> => mutate(this.route, data, options);

  revalidation = () => mutate(this.route);

  updateUser = (newUseData: UserT): Promise<any> =>
    this.mutate(
      async (chaseData: any) => {
        try {
          const updatedData = await this.updateUserApi({
            ...(chaseData || {}),
            ...newUseData,
          });
          if (updatedData) {
            return this.parser(updatedData);
          }
          return chaseData;
        } catch (error) {
          console.log("run same toast error handling");
          return chaseData;
        }
      },
      { revalidate: false }
    );

  logout = () =>
    this.mutate(
      undefined,
      {
        revalidate: false,
      }
    );

  updateUserApi = async (data:UserT) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("updating user");
        resolve(data);
      }, 1000);
    });
  };

  static getInstance() {
    return new User();
  }
}

export default User;
