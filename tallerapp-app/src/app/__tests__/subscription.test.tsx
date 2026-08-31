import React from "react";
import { render } from "@testing-library/react-native";
import SubscriptionScreen from "../(protected)/(subscriptions)/index";

jest.mock("@/hooks/useSubscription", () => ({
  useSubscription: jest.fn(),
  usePlans: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

const mockUseSubscription = require("@/hooks/useSubscription").useSubscription;

const mockSubscription = {
  id: 1,
  organization_id: 1,
  plan_id: 1,
  status: "active",
  starts_at: "2026-01-01",
  ends_at: "2026-12-31",
  plan: {
    id: 1,
    name: "Plan Pro",
    price: 99.99,
    duration_months: 12,
    is_active: true,
    plan_features: [
      { id: 1, plan_id: 1, name: "Servicios ilimitados", value: "true" },
      { id: 2, plan_id: 1, name: "Soporte prioritario", value: "true" },
    ],
  },
};

describe("SubscriptionScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows loading state", () => {
    mockUseSubscription.mockReturnValue({ data: null, isLoading: true, isError: false });
    const { getByText } = render(<SubscriptionScreen />);
    expect(getByText("Cargando suscripcion...")).toBeTruthy();
  });

  it("shows error state", () => {
    mockUseSubscription.mockReturnValue({ data: null, isLoading: false, isError: true });
    const { getByText } = render(<SubscriptionScreen />);
    expect(getByText("Error")).toBeTruthy();
  });

  it("renders subscription data", () => {
    mockUseSubscription.mockReturnValue({ data: mockSubscription, isLoading: false, isError: false });
    const { getByText } = render(<SubscriptionScreen />);
    expect(getByText("Suscripcion")).toBeTruthy();
    expect(getByText("ACTIVE")).toBeTruthy();
    expect(getByText("Plan: Plan Pro")).toBeTruthy();
  });

  it("displays plan price and features", () => {
    mockUseSubscription.mockReturnValue({ data: mockSubscription, isLoading: false, isError: false });
    const { getByText } = render(<SubscriptionScreen />);
    expect(getByText("$99.99 / 12 meses")).toBeTruthy();
    expect(getByText("Servicios ilimitados")).toBeTruthy();
    expect(getByText("Soporte prioritario")).toBeTruthy();
  });

  it("displays dates", () => {
    mockUseSubscription.mockReturnValue({ data: mockSubscription, isLoading: false, isError: false });
    const { getByText } = render(<SubscriptionScreen />);
    expect(getByText("Inicio")).toBeTruthy();
    expect(getByText("Fin")).toBeTruthy();
  });

  it("handles no plan", () => {
    mockUseSubscription.mockReturnValue({
      data: { ...mockSubscription, plan: null },
      isLoading: false,
      isError: false,
    });
    const { getByText, queryByText } = render(<SubscriptionScreen />);
    expect(getByText("ACTIVE")).toBeTruthy();
    expect(queryByText("Plan:")).toBeNull();
  });
});
