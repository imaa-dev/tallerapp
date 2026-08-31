import React from "react";
import { render } from "@testing-library/react-native";
import UsersScreen from "../(protected)/(users)/index";

jest.mock("@/hooks/useUsers", () => ({
  useUsers: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

const mockUseUsers = require("@/hooks/useUsers").useUsers;

const mockUsersData = {
  users: [
    { id: 1, name: "Juan", email: "juan@test.com", rol: "ADMIN", created_at: "2026-01-01" },
    { id: 2, name: "Pedro", email: "pedro@test.com", rol: "TECHNICIAN", created_at: "2026-01-02" },
  ],
  pagination: { current_page: 1, last_page: 1, per_page: 50, total: 2, from: 1, to: 2 },
};

describe("UsersScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows loading state", () => {
    mockUseUsers.mockReturnValue({ data: null, isLoading: true, isError: false });
    const { getByText } = render(<UsersScreen />);
    expect(getByText("Cargando usuarios...")).toBeTruthy();
  });

  it("shows error state", () => {
    mockUseUsers.mockReturnValue({ data: null, isLoading: false, isError: true });
    const { getByText } = render(<UsersScreen />);
    expect(getByText("Error")).toBeTruthy();
  });

  it("renders users list", () => {
    mockUseUsers.mockReturnValue({ data: mockUsersData, isLoading: false, isError: false });
    const { getByText } = render(<UsersScreen />);
    expect(getByText("Usuarios")).toBeTruthy();
    expect(getByText("Juan")).toBeTruthy();
    expect(getByText("Pedro")).toBeTruthy();
  });

  it("shows empty state when no users", () => {
    mockUseUsers.mockReturnValue({
      data: { ...mockUsersData, users: [] },
      isLoading: false,
      isError: false,
    });
    const { getByText } = render(<UsersScreen />);
    expect(getByText("Sin usuarios")).toBeTruthy();
  });
});
