import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import RegisterScreen from "../register";
import {
  registerRequest,
  getWorkshopTypesRequest,
} from "@/services/auth/auth.service";

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

const mockWorkshopTypes = [
  { id: 1, name: "Taller mecanico" },
  { id: 2, name: "Taller de bicicletas" },
  { id: 3, name: "Taller de electronica y celulares" },
];

describe("RegisterScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getWorkshopTypesRequest as jest.Mock).mockResolvedValue(mockWorkshopTypes);
  });

  it("renders step 1 with name input", () => {
    const { getByPlaceholderText, getByText } = renderWithAuth(<RegisterScreen />);

    expect(getByText("Quien esta creando la cuenta?")).toBeTruthy();
    expect(getByPlaceholderText("Nombre completo")).toBeTruthy();
    expect(getByText("Continuar")).toBeTruthy();
  });

  it("shows error when trying to advance step 1 with empty name", async () => {
    const { getByText } = renderWithAuth(<RegisterScreen />);

    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(getByText("Ingresa tu nombre")).toBeTruthy();
    });
  });

  it("advances to step 2 when name is provided", async () => {
    const { getByText, getByPlaceholderText } = renderWithAuth(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("Nombre completo"), "John Doe");
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(getByText("Como se llama tu negocio?")).toBeTruthy();
    });
  });

  it("navigates back between steps", async () => {
    const { getByText, getByPlaceholderText } = renderWithAuth(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("Nombre completo"), "John");
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(getByText("Como se llama tu negocio?")).toBeTruthy();
    });

    fireEvent.press(getByText("Atras"));

    await waitFor(() => {
      expect(getByText("Quien esta creando la cuenta?")).toBeTruthy();
    });
  });

  it("loads workshop types on mount", async () => {
    renderWithAuth(<RegisterScreen />);

    await waitFor(() => {
      expect(getWorkshopTypesRequest).toHaveBeenCalled();
    });
  });

  it("advances to step 3 with workshop type selection", async () => {
    const { getByText, getByPlaceholderText } = renderWithAuth(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("Nombre completo"), "John");
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(getByText("Como se llama tu negocio?")).toBeTruthy();
    });

    fireEvent.changeText(
      getByPlaceholderText("Ej: Taller Mecanico El Maestro"),
      "My Workshop"
    );
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(getByText("Que tipo de taller es?")).toBeTruthy();
      expect(getByText("Taller mecanico")).toBeTruthy();
    });
  });

  it("advances to step 4 after selecting workshop type", async () => {
    const { getByText, getByPlaceholderText } = renderWithAuth(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("Nombre completo"), "John");
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(getByText("Como se llama tu negocio?")).toBeTruthy();
    });

    fireEvent.changeText(
      getByPlaceholderText("Ej: Taller Mecanico El Maestro"),
      "My Workshop"
    );
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(getByText("Que tipo de taller es?")).toBeTruthy();
    });

    fireEvent.press(getByText("Taller mecanico"));
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(getByText("Crea tu cuenta")).toBeTruthy();
    });
  });

  it("submits registration form with correct data", async () => {
    (registerRequest as jest.Mock).mockResolvedValue({
      token: "new-token",
      user: { id: 1, name: "John" },
    });

    const { getByText, getByPlaceholderText } = renderWithAuth(<RegisterScreen />);

    // Step 1
    fireEvent.changeText(getByPlaceholderText("Nombre completo"), "John");
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(getByText("Como se llama tu negocio?")).toBeTruthy();
    });

    // Step 2
    fireEvent.changeText(
      getByPlaceholderText("Ej: Taller Mecanico El Maestro"),
      "My Workshop"
    );
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(getByText("Que tipo de taller es?")).toBeTruthy();
    });

    // Step 3
    fireEvent.press(getByText("Taller mecanico"));
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(getByText("Crea tu cuenta")).toBeTruthy();
    });

    // Step 4
    fireEvent.changeText(getByPlaceholderText("correo@ejemplo.com"), "john@test.com");
    fireEvent.changeText(getByPlaceholderText("Contrasena"), "password123");
    fireEvent.changeText(getByPlaceholderText("Confirmar contrasena"), "password123");

    fireEvent.press(getByText("Crear Cuenta"));

    await waitFor(() => {
      expect(registerRequest).toHaveBeenCalledWith({
        name: "John",
        email: "john@test.com",
        password: "password123",
        password_confirmation: "password123",
        nameOrganization: "My Workshop",
        workshop_type_id: 1,
      });
    });
  });

  it("calls authContext.login after successful registration", async () => {
    (registerRequest as jest.Mock).mockResolvedValue({
      token: "new-token",
      user: { id: 1, name: "John" },
    });

    const { getByText, getByPlaceholderText } = renderWithAuth(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("Nombre completo"), "John");
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(getByText("Como se llama tu negocio?")).toBeTruthy();
    });

    fireEvent.changeText(
      getByPlaceholderText("Ej: Taller Mecanico El Maestro"),
      "My Workshop"
    );
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(getByText("Que tipo de taller es?")).toBeTruthy();
    });

    fireEvent.press(getByText("Taller mecanico"));
    fireEvent.press(getByText("Continuar"));

    await waitFor(() => {
      expect(getByText("Crea tu cuenta")).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText("correo@ejemplo.com"), "john@test.com");
    fireEvent.changeText(getByPlaceholderText("Contrasena"), "password123");
    fireEvent.changeText(getByPlaceholderText("Confirmar contrasena"), "password123");

    fireEvent.press(getByText("Crear Cuenta"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("new-token", { id: 1, name: "John" });
    });
  });
});
