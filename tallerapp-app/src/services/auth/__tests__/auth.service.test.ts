import { axiosInstance } from "../../api/axiosInstance";
import {
  loginRequest,
  registerRequest,
  completeLoginRequest,
  logoutRequest,
  getWorkshopTypesRequest,
} from "../auth.service";

jest.mock("../../api/axiosInstance", () => ({
  axiosInstance: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe("auth.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loginRequest", () => {
    it("sends POST to /auth/login with credentials", async () => {
      const mockResponse = {
        data: { success: true, token: "abc123", user: { id: 1, name: "Test" } },
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await loginRequest({
        email: "test@test.com",
        password: "password123",
      });

      expect(mockedAxios.post).toHaveBeenCalledWith("/auth/login", {
        email: "test@test.com",
        password: "password123",
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("propagates errors from the API", async () => {
      mockedAxios.post.mockRejectedValue(new Error("Unauthorized"));

      await expect(
        loginRequest({ email: "a@b.com", password: "wrong" })
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("registerRequest", () => {
    it("sends POST to /auth/register with all fields", async () => {
      const mockResponse = {
        data: { success: true, token: "token123", user: { id: 2 } },
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const payload = {
        name: "John",
        email: "john@test.com",
        password: "password123",
        password_confirmation: "password123",
        nameOrganization: "My Workshop",
        workshop_type_id: 1,
      };

      const result = await registerRequest(payload);

      expect(mockedAxios.post).toHaveBeenCalledWith("/auth/register", payload);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("completeLoginRequest", () => {
    it("sends POST to /auth/complete-login with login_id and organization_id", async () => {
      const mockResponse = {
        data: { success: true, token: "token456", user: { id: 1 } },
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await completeLoginRequest("1_1234567890", 5);

      expect(mockedAxios.post).toHaveBeenCalledWith("/auth/complete-login", {
        login_id: "1_1234567890",
        organization_id: 5,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("logoutRequest", () => {
    it("sends POST to /auth/logout", async () => {
      mockedAxios.post.mockResolvedValue({ data: { message: "Logout exitoso" } });

      await logoutRequest();

      expect(mockedAxios.post).toHaveBeenCalledWith("/auth/logout");
    });
  });

  describe("getWorkshopTypesRequest", () => {
    it("sends GET to /workshop-types", async () => {
      const mockTypes = [
        { id: 1, name: "Taller mecanico" },
        { id: 2, name: "Taller de bicicletas" },
      ];
      mockedAxios.get.mockResolvedValue({ data: mockTypes });

      const result = await getWorkshopTypesRequest();

      expect(mockedAxios.get).toHaveBeenCalledWith("/workshop-types");
      expect(result).toEqual(mockTypes);
    });
  });
});
