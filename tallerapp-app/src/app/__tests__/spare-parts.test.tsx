import React from "react";
import { render } from "@testing-library/react-native";
import SparePartsScreen from "../(protected)/(spare-parts)/index";

jest.mock("@/hooks/useSpareParts", () => ({
  useSpareParts: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

const mockUseSpareParts = require("@/hooks/useSpareParts").useSpareParts;

const mockSparePartsData = {
  spareParts: [
    { id: 1, organization_id: 1, user_id: 1, model: "iPhone 15", brand: "Apple", price: 2500, created_at: "2026-01-01" },
    { id: 2, organization_id: 1, user_id: 1, model: "Galaxy S24", brand: "Samsung", price: 1800, note: "Pantalla", created_at: "2026-01-02" },
  ],
  pagination: { current_page: 1, last_page: 1, per_page: 50, total: 2, from: 1, to: 2 },
};

describe("SparePartsScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows loading state", () => {
    mockUseSpareParts.mockReturnValue({ data: null, isLoading: true, isError: false });
    const { getByText } = render(<SparePartsScreen />);
    expect(getByText("Cargando repuestos...")).toBeTruthy();
  });

  it("shows error state", () => {
    mockUseSpareParts.mockReturnValue({ data: null, isLoading: false, isError: true });
    const { getByText } = render(<SparePartsScreen />);
    expect(getByText("Error")).toBeTruthy();
  });

  it("renders spare parts list", () => {
    mockUseSpareParts.mockReturnValue({ data: mockSparePartsData, isLoading: false, isError: false });
    const { getByText } = render(<SparePartsScreen />);
    expect(getByText("Repuestos")).toBeTruthy();
    expect(getByText("Apple iPhone 15")).toBeTruthy();
    expect(getByText("Samsung Galaxy S24")).toBeTruthy();
  });

  it("displays prices", () => {
    mockUseSpareParts.mockReturnValue({ data: mockSparePartsData, isLoading: false, isError: false });
    const { getByText } = render(<SparePartsScreen />);
    expect(getByText("$2,500")).toBeTruthy();
    expect(getByText("$1,800")).toBeTruthy();
  });

  it("shows empty state when no spare parts", () => {
    mockUseSpareParts.mockReturnValue({
      data: { ...mockSparePartsData, spareParts: [] },
      isLoading: false,
      isError: false,
    });
    const { getByText } = render(<SparePartsScreen />);
    expect(getByText("Sin repuestos")).toBeTruthy();
  });
});
