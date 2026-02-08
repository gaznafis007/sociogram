import api from "./api";
import { API_ENDPOINTS } from "../constants/config";
import { Post, ApiResponse, PaginatedResponse } from "../types/post";

export type CreatePostData = {
  content: string;
  tags?: string[];
};

export type UpdatePostData = {
  content: string;
  tags?: string[];
};

export type AddCommentData = {
  content: string;
};

export type GetPostsParams = {
  page?: number;
  limit?: number;
  username?: string;
};

class PostService {
  async getPosts(
    params: GetPostsParams = {},
  ): Promise<PaginatedResponse<Post>> {
    const response = await api.get<PaginatedResponse<Post>>(
      API_ENDPOINTS.POSTS,
      { params },
    );
    return response.data;
  }

  async getPost(postId: string): Promise<Post> {
    const response = await api.get<ApiResponse<Post>>(
      API_ENDPOINTS.POST_BY_ID(postId),
    );
    return response.data.data;
  }

  async createPost(data: CreatePostData): Promise<Post> {
    const response = await api.post<ApiResponse<Post>>(
      API_ENDPOINTS.POSTS,
      data,
    );
    return response.data.data;
  }

  async updatePost(postId: string, data: UpdatePostData): Promise<Post> {
    const response = await api.put<ApiResponse<Post>>(
      API_ENDPOINTS.UPDATE_POST(postId),
      data,
    );
    return response.data.data;
  }

  async deletePost(postId: string): Promise<void> {
    await api.delete(API_ENDPOINTS.DELETE_POST(postId));
  }

  async likePost(postId: string): Promise<Post> {
    const response = await api.post<ApiResponse<Post>>(
      API_ENDPOINTS.LIKE_POST(postId),
    );
    return response.data.data;
  }

  async addComment(postId: string, data: AddCommentData): Promise<Post> {
    const response = await api.post<ApiResponse<Post>>(
      API_ENDPOINTS.ADD_COMMENT(postId),
      data,
    );
    return response.data.data;
  }

  async deleteComment(postId: string, commentId: string): Promise<void> {
    await api.delete(API_ENDPOINTS.DELETE_COMMENT(postId, commentId));
  }
}

export const postService = new PostService();
