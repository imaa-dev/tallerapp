import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import OrganizationScreen from "../(protected)/(organization)/index";

jest.mock("@/hooks/useOrganization", () => ({
  useOrganization: jest.fn(),
}));

jest.mock("@/services/organization/organization.service", () => ({
  getOrganizationRequest: jest.fn(),
  updateOrganizationRequest: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useMutation: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

const mockMutate = jest.fn();
const mockUseOrganization = require("@/hooks/useOrganization").useOrganization;

const mockOrg = {
  id: 1,
  name: "Mi Taller",
  description: "Taller de prueba",
  email: "test@taller.com",
  phone: "1234567890",
  address: "Calle 123",
  city: "CDMX",
  state: "CDMX",
  country: "MX",
};

describe("OrganizationScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows loading state", () => {
    mockUseOrganization.mockReturnValue({ data: null, isLoading: true, isError: false });
    const { getByText } = render(<OrganizationScreen />);
    expect(getByText("Cargando organizacion...")).toBeTruthy();
  });

  it("shows error state", () => {
    mockUseOrganization.mockReturnValue({ data: null, isLoading: false, isError: true });
    const { getByText } = render(<OrganizationScreen />);
    expect(getByText("Error")).toBeTruthy();
  });

  it("renders organization data", () => {
    mockUseOrganization.mockReturnValue({ data: mockOrg, isLoading: false, isError: false });
    const { getAllByText } = render(<OrganizationScreen />);
    expect(getAllByText("Organizacion").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("Datos generales").length).toBe(1);
    expect(getAllByText("Direccion").length).toBeGreaterThanOrEqual(1);
  });

  it("renders save button", () => {
    mockUseOrganization.mockReturnValue({ data: mockOrg, isLoading: false, isError: false });
    const { getByText } = render(<OrganizationScreen />);
    expect(getByText("Guardar cambios")).toBeTruthy();
  });

  it("calls mutation on save", async () => {
    mockUseOrganization.mockReturnValue({ data: mockOrg, isLoading: false, isError: false });
    const { getByText } = render(<OrganizationScreen />);
    await waitFor(() => {
      fireEvent.press(getByText("Guardar cambios"));
    });
    expect(mockMutate).toHaveBeenCalled();
  });
});
