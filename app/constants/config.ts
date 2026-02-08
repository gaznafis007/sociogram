import Constants from "expo-constants";

// API Configuration
export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export const NODE_ENV =
  Constants.expoConfig?.extra?.nodeEnv ||
  process.env.EXPO_PUBLIC_NODE_ENV ||
  "development";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  SIGNUP: "/api/auth/signup",
  LOGIN: "/api/auth/login",
  PROFILE: "/api/auth/profile",
  UPDATE_PROFILE: "/api/auth/profile",
  DEVICE_TOKEN: "/api/auth/device-token",
  USER_BY_USERNAME: (username: string) => `/api/auth/users/${username}`,
  SEARCH_USERS: "/api/auth/search",

  // Posts
  POSTS: "/api/posts",
  POST_BY_ID: (id: string) => `/api/posts/${id}`,
  UPDATE_POST: (id: string) => `/api/posts/${id}`,
  DELETE_POST: (id: string) => `/api/posts/${id}`,
  LIKE_POST: (id: string) => `/api/posts/${id}/like`,
  ADD_COMMENT: (id: string) => `/api/posts/${id}/comment`,
  DELETE_COMMENT: (postId: string, commentId: string) =>
    `/api/posts/${postId}/comment/${commentId}`,
} as const;

export default {
  API_BASE_URL,
  NODE_ENV,
  API_ENDPOINTS,
};
