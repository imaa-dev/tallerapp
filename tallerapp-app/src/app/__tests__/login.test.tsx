import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../login";
import { loginRequest } from "@/services/auth/auth.service";

const mockLogin = jest.fn();
const mockStartPendingLogin = jest.fn();
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
            pendingLogin: null,
            startPendingLogin: mockStartPendingLogin,
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

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email and password inputs", () => {
    const { getByPlaceholderText } = renderWithAuth(<LoginScreen />);

    expect(getByPlaceholderText("correo@ejemplo.com")).toBeTruthy();
    expect(getByPlaceholderText("Ingrese contrasena")).toBeTruthy();
  });

  it("renders login button", () => {
    const { getByText } = renderWithAuth(<LoginScreen />);
    expect(getByText("Entrar")).toBeTruthy();
  });

  it("renders register link", () => {
    const { getByText } = renderWithAuth(<LoginScreen />);
    expect(getByText("Registrate")).toBeTruthy();
  });

  it("shows validation error when email is empty", async () => {
    const { getByText, getByPlaceholderText } = renderWithAuth(<LoginScreen />);

    const passwordInput = getByPlaceholderText("Ingrese contrasena");
    fireEvent.changeText(passwordInput, "password123");

    fireEvent.press(getByText("Entrar"));

    await waitFor(() => {
      expect(getByText("El correo es obligatorio")).toBeTruthy();
    });
  });

  it("shows validation error when password is empty", async () => {
    const { getByText, getByPlaceholderText } = renderWithAuth(<LoginScreen />);

    const emailInput = getByPlaceholderText("correo@ejemplo.com");
    fireEvent.changeText(emailInput, "test@test.com");

    fireEvent.press(getByText("Entrar"));

    await waitFor(() => {
      expect(getByText("La contrasena es obligatoria")).toBeTruthy();
    });
  });

  it("calls loginRequest with correct data on submit", async () => {
    (loginRequest as jest.Mock).mockResolvedValue({
      success: true,
      token: "test-token",
      user: { id: 1, name: "Test" },
    });

    const { getByText, getByPlaceholderText } = renderWithAuth(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("correo@ejemplo.com"), "test@test.com");
    fireEvent.changeText(getByPlaceholderText("Ingrese contrasena"), "password123");
    fireEvent.press(getByText("Entrar"));

    await waitFor(() => {
      expect(loginRequest).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
    });
  });

  it("calls authContext.login on successful single-org login", async () => {
    (loginRequest as jest.Mock).mockResolvedValue({
      success: true,
      token: "test-token",
      user: { id: 1, name: "Test" },
    });

    const { getByText, getByPlaceholderText } = renderWithAuth(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("correo@ejemplo.com"), "test@test.com");
    fireEvent.changeText(getByPlaceholderText("Ingrese contrasena"), "password123");
    fireEvent.press(getByText("Entrar"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test-token", { id: 1, name: "Test" });
    });
  });

  it("calls startPendingLogin on multi-org response", async () => {
    (loginRequest as jest.Mock).mockResolvedValue({
      success: false,
      login_id: "1_123",
      user: { id: 1, name: "Test" },
      organizations: [{ id: 1, name: "Org A" }],
    });

    const { getByText, getByPlaceholderText } = renderWithAuth(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("correo@ejemplo.com"), "test@test.com");
    fireEvent.changeText(getByPlaceholderText("Ingrese contrasena"), "password123");
    fireEvent.press(getByText("Entrar"));

    await waitFor(() => {
      expect(mockStartPendingLogin).toHaveBeenCalledWith({
        loginId: "1_123",
        user: { id: 1, name: "Test" },
        organizations: [{ id: 1, name: "Org A" }],
      });
    });
  });
});
