import { User } from "@/types/user.t";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const ORG_KEY = "organization_id";

export const saveToken = async (token: string) => {
    await SecureStore.setItem(TOKEN_KEY, token);
}

export const getToken = async () => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
}

export const deleteToken = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export const saveUser = async (user: User) => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const user = await SecureStore.getItemAsync(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const deleteUser = async () => {
  await SecureStore.deleteItemAsync(USER_KEY);
};

export const saveOrganizationId = async (orgId: number | null) => {
  if (orgId) {
    await SecureStore.setItemAsync(ORG_KEY, orgId.toString());
  }
};

export const getOrganizationId = async (): Promise<number | null> => {
  const org = await SecureStore.getItemAsync(ORG_KEY);
  return org ? Number(org) : null;
};

export const deleteOrganizationId = async () => {
  await SecureStore.deleteItemAsync(ORG_KEY);
};