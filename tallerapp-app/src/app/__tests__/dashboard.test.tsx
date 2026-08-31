import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import DashboardScreen from "../(protected)/(dashboard)/index";

jest.mock("@/hooks/useDashboard", () => ({
  useDashboard: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

const mockUseDashboard = require("@/hooks/useDashboard").useDashboard;

const mockDashboardData = {
  services: {
    total: 25,
    active: 18,
    status: [
      { slug: "recepcionados", label: "Recepción", count: 5, color: "#3B82F6" },
      { slug: "diagnosticados", label: "Diagnóstico", count: 3, color: "#8B5CF6" },
    ],
  },
  clients: { total: 120, new_this_month: 15, recurring: 45 },
  business: { revenue_this_month: 50000, avg_ticket: 2000 },
  counts: { products: 30, clients: 120, services: 25, services_reparaciones: 8, others: 12 },
};

describe("DashboardScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows loading state", () => {
    mockUseDashboard.mockReturnValue({ data: null, isLoading: true, isError: false });
    const { getByText } = render(<DashboardScreen />);
    expect(getByText("Cargando dashboard...")).toBeTruthy();
  });

  it("shows error state", () => {
    mockUseDashboard.mockReturnValue({ data: null, isLoading: false, isError: true });
    const { getByText } = render(<DashboardScreen />);
    expect(getByText("Error")).toBeTruthy();
  });

  it("renders dashboard data", () => {
    mockUseDashboard.mockReturnValue({ data: mockDashboardData, isLoading: false, isError: false });
    const { getByText } = render(<DashboardScreen />);
    expect(getByText("Panel Central")).toBeTruthy();
    expect(getByText("25")).toBeTruthy();
    expect(getByText("18")).toBeTruthy();
    expect(getByText("Recepción")).toBeTruthy();
    expect(getByText("Diagnóstico")).toBeTruthy();
  });

  it("displays clients and business stats", () => {
    mockUseDashboard.mockReturnValue({ data: mockDashboardData, isLoading: false, isError: false });
    const { getByText } = render(<DashboardScreen />);
    expect(getByText("120")).toBeTruthy();
    expect(getByText("15")).toBeTruthy();
    expect(getByText("$50,000")).toBeTruthy();
  });

  it("displays summary counts", () => {
    mockUseDashboard.mockReturnValue({ data: mockDashboardData, isLoading: false, isError: false });
    const { getByText } = render(<DashboardScreen />);
    expect(getByText("30")).toBeTruthy();
    expect(getByText("12")).toBeTruthy();
  });
});
