import React from "react";
import { render } from "@testing-library/react-native";
import DocumentsScreen from "../(protected)/(documents)/index";

jest.mock("@/hooks/useDocuments", () => ({
  useDocuments: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

const mockUseDocuments = require("@/hooks/useDocuments").useDocuments;

const mockDocumentsData = {
  documents: [
    { id: 1, organization_id: 1, servi_id: 1, type: "Factura", number: "001", date: "2026-01-15", status: "Pagado", amount: 5000, created_at: "2026-01-15" },
    { id: 2, organization_id: 1, servi_id: 2, type: "Presupuesto", number: "002", date: "2026-01-16", status: "Pendiente", amount: 3000, created_at: "2026-01-16" },
  ],
  pagination: { current_page: 1, last_page: 1, per_page: 50, total: 2, from: 1, to: 2 },
};

describe("DocumentsScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows loading state", () => {
    mockUseDocuments.mockReturnValue({ data: null, isLoading: true, isError: false });
    const { getByText } = render(<DocumentsScreen />);
    expect(getByText("Cargando documentos...")).toBeTruthy();
  });

  it("shows error state", () => {
    mockUseDocuments.mockReturnValue({ data: null, isLoading: false, isError: true });
    const { getByText } = render(<DocumentsScreen />);
    expect(getByText("Error")).toBeTruthy();
  });

  it("renders documents list", () => {
    mockUseDocuments.mockReturnValue({ data: mockDocumentsData, isLoading: false, isError: false });
    const { getByText } = render(<DocumentsScreen />);
    expect(getByText("Documentos")).toBeTruthy();
    expect(getByText("Factura #001")).toBeTruthy();
    expect(getByText("Presupuesto #002")).toBeTruthy();
  });

  it("displays amounts", () => {
    mockUseDocuments.mockReturnValue({ data: mockDocumentsData, isLoading: false, isError: false });
    const { getByText } = render(<DocumentsScreen />);
    expect(getByText("$5,000")).toBeTruthy();
    expect(getByText("$3,000")).toBeTruthy();
  });

  it("shows empty state when no documents", () => {
    mockUseDocuments.mockReturnValue({
      data: { ...mockDocumentsData, documents: [] },
      isLoading: false,
      isError: false,
    });
    const { getByText } = render(<DocumentsScreen />);
    expect(getByText("Sin documentos")).toBeTruthy();
  });
});
