import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { AuthProvider, AuthContext } from "../authContext";
import { deleteToken, saveToken, saveUser, getUser, getToken } from "@/utils/secureStorage";
import { logoutRequest } from "@/services/auth/auth.service";

jest.mock("@/utils/secureStorage", () => ({
  saveToken: jest.fn().mockResolvedValue(undefined),
  getToken: jest.fn().mockResolvedValue(null),
  deleteToken: jest.fn().mockResolvedValue(undefined),
  saveUser: jest.fn().mockResolvedValue(undefined),
  getUser: jest.fn().mockResolvedValue(null),
  deleteUser: jest.fn().mockResolvedValue(undefined),
  saveOrganizationId: jest.fn().mockResolvedValue(undefined),
  getOrganizationId: jest.fn().mockResolvedValue(null),
  deleteOrganizationId: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/services/auth/auth.service", () => ({
  logoutRequest: jest.fn().mockResolvedValue(undefined),
  loginRequest: jest.fn(),
  registerRequest: jest.fn(),
  completeLoginRequest: jest.fn(),
  getWorkshopTypesRequest: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

const mockUser = { id: 1, name: "Test User", email: "test@test.com", rol: "ADMIN" as const };

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("starts with null token and user", () => {
    const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
  });

  it("login saves token and user to SecureStore", async () => {
    const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

    await act(async () => {
      await result.current.login("test-token", mockUser);
    });

    expect(saveToken).toHaveBeenCalledWith("test-token");
    expect(saveUser).toHaveBeenCalledWith(mockUser);
    expect(result.current.token).toBe("test-token");
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoggedIn).toBe(true);
  });

  it("logout calls API and clears state", async () => {
    const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

    await act(async () => {
      await result.current.login("test-token", mockUser);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(logoutRequest).toHaveBeenCalled();
    expect(deleteToken).toHaveBeenCalled();
    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
  });

  it("startPendingLogin sets pending login data", () => {
    const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

    const pending = {
      loginId: "1_123",
      user: mockUser,
      organizations: [{ id: 1, name: "Org 1" }],
    };

    act(() => {
      result.current.startPendingLogin(pending);
    });

    expect(result.current.pendingLogin).toEqual(pending);
  });

  it("clearPendingLogin clears pending login data", () => {
    const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

    act(() => {
      result.current.startPendingLogin({
        loginId: "1_123",
        user: mockUser,
        organizations: [],
      });
    });

    act(() => {
      result.current.clearPendingLogin();
    });

    expect(result.current.pendingLogin).toBeNull();
  });
});
