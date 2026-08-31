import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SelectOrganization from "../select-organization";
import { completeLoginRequest } from "@/services/auth/auth.service";

const mockLogin = jest.fn();
const mockPush = jest.fn();

jest.mock("@/services/auth/auth.service", () => ({
  loginRequest: jest.fn(),
  registerRequest: jest.fn(),
  completeLoginRequest: jest.fn(),
  logoutRequest: jest.fn(),
  getWorkshopTypesRequest: jest.fn(),
}));

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: mockPush,
  }),
  useLocalSearchParams: () => ({
    organizations: JSON.stringify([
      { id: 1, name: "Workshop A" },
      { id: 2, name: "Workshop B" },
    ]),
  }),
}));

jest.mock("@/context/authContext", () => {
  const ReactActual = jest.requireActual("react");
  const ctx = ReactActual.createContext(null);
  return {
    AuthContext: ctx,
    AuthProvider: ({ children, value }: any) =>
      ReactActual.createElement(
        ctx.Provider,
        {
          value: value ?? {
            token: null,
            user: null,
            pendingLogin: {
              loginId: "1_123456",
              user: { id: 1, name: "Test" },
              organizations: [],
            },
            startPendingLogin: jest.fn(),
            clearPendingLogin: jest.fn(),
            isLoggedIn: false,
            login: mockLogin,
            logout: jest.fn(),
          },
        },
        children
      ),
  };
});

const { AuthProvider } = require("@/context/authContext");

const renderWithAuth = (ui: React.ReactElement) =>
  render(<AuthProvider>{ui}</AuthProvider>);

describe("SelectOrganization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title and organization list", () => {
    const { getByText } = renderWithAuth(<SelectOrganization />);

    expect(getByText("Selecciona una organización")).toBeTruthy();
    expect(getByText("Workshop A")).toBeTruthy();
    expect(getByText("Workshop B")).toBeTruthy();
  });

  it("renders continue button", () => {
    const { getByText } = renderWithAuth(<SelectOrganization />);
    expect(getByText("Continuar")).toBeTruthy();
  });

  it("calls completeLoginRequest when org is selected and continue pressed", async () => {
    (completeLoginRequest as jest.Mock).mockResolvedValue({
      success: true,
      token: "org-token",
      user: { id: 1, name: "Test" },
    });

    const { getByText } = renderWithAuth(<SelectOrganization />);

    fireEvent.press(getByText("Workshop A"));
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(completeLoginRequest).toHaveBeenCalledWith("1_123456", 1);
    });
  });

  it("calls login and navigates to home after successful completion", async () => {
    (completeLoginRequest as jest.Mock).mockResolvedValue({
      success: true,
      token: "org-token",
      user: { id: 1, name: "Test" },
    });

    const { getByText } = renderWithAuth(<SelectOrganization />);

    fireEvent.press(getByText("Workshop A"));
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("org-token", { id: 1, name: "Test" });
      expect(mockPush).toHaveBeenCalledWith({ pathname: "/" });
    });
  });
});
