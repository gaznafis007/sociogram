import api, { tokenManager } from "./api";
import { API_ENDPOINTS } from "../constants/config";
import { User, ApiResponse } from "../types/post";

export type SignupData = {
  username: string;
  email: string;
  password: string;
  fullName: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type UpdateProfileData = {
  fullName?: string;
  bio?: string;
  profileImage?: string;
};

class AuthService {
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.SIGNUP,
      data,
    );

    // Store token
    await tokenManager.setToken(response.data.data.token);

    return response.data.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.LOGIN,
      data,
    );

    // Store token
    await tokenManager.setToken(response.data.data.token);

    return response.data.data;
  }

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.PROFILE);
    return response.data.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put<ApiResponse<User>>(
      API_ENDPOINTS.UPDATE_PROFILE,
      data,
    );
    return response.data.data;
  }

  async updateDeviceToken(token: string): Promise<void> {
    await api.put(API_ENDPOINTS.DEVICE_TOKEN, { deviceToken: token });
  }

  async getUserByUsername(username: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(
      API_ENDPOINTS.USER_BY_USERNAME(username),
    );
    return response.data.data;
  }

  async searchUsers(query: string, page = 1, limit = 10): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>(
      API_ENDPOINTS.SEARCH_USERS,
      {
        params: { query, page, limit },
      },
    );
    return response.data.data;
  }

  async logout(): Promise<void> {
    await tokenManager.removeToken();
  }
}

export const authService = new AuthService();
