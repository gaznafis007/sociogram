import { Request, Response } from 'express';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { createPostSchema, createCommentSchema } from '../utils/validators';
import { NotFoundError, AuthenticationError } from '../utils/errors';
import { ResponseHandler } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';
import { notificationService } from '../services/notification.service';
import { AuthRequest } from '../types';

export const createPost = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AuthenticationError();
  }

  const body = createPostSchema.parse(req.body);

  const post = await Post.create({
    author: req.user.userId,
    content: body.content,
    tags: body.tags || [],
  });

  await post.populate('author', 'username fullName profileImage');

  ResponseHandler.created(res, post, 'Post created successfully');
});

export const getFeeds = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { limit = 10, page = 1, username } = req.query;

  const limitNum = Math.min(parseInt(limit as string) || 10, 50);
  const pageNum = Math.max(parseInt(page as string) || 1, 1);
  const skip = (pageNum - 1) * limitNum;

  let filter = {};

  if (username && typeof username === 'string') {
    const author = await User.findOne({ username });
    if (!author) {
      throw new NotFoundError('User');
    }
    filter = { author: author._id };
  }

  const posts = await Post.find(filter)
    .populate('author', 'username fullName profileImage')
    .populate('comments.author', 'username fullName profileImage')
    .sort({ createdAt: -1 })
    .limit(limitNum)
    .skip(skip);

  const total = await Post.countDocuments(filter);

  ResponseHandler.paginated(res, posts, total, pageNum, limitNum, 'Feeds retrieved successfully');
});

export const getPostById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;

  const post = await Post.findById(postId)
    .populate('author', 'username fullName profileImage')
    .populate('comments.author', 'username fullName profileImage')
    .populate('likes', 'username fullName');

  if (!post) {
    throw new NotFoundError('Post');
  }

  ResponseHandler.success(res, post, 'Post retrieved successfully');
});

export const updatePost = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AuthenticationError();
  }

  const { postId } = req.params;
  const body = createPostSchema.parse(req.body);

  const post = await Post.findById(postId);

  if (!post) {
    throw new NotFoundError('Post');
  }

  if (post.author.toString() !== req.user.userId) {
    throw new Error('Unauthorized to update this post');
  }

  post.content = body.content;
  post.tags = body.tags || [];

  await post.save();
  await post.populate('author', 'username fullName profileImage');

  ResponseHandler.success(res, post, 'Post updated successfully');
});

export const deletePost = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AuthenticationError();
  }

  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new NotFoundError('Post');
  }

  if (post.author.toString() !== req.user.userId) {
    throw new Error('Unauthorized to delete this post');
  }

  await Post.deleteOne({ _id: postId });

  ResponseHandler.noContent(res, 'Post deleted successfully');
});

export const likePost = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AuthenticationError();
  }

  const { postId } = req.params;
  const userId = req.user.userId;

  const post = await Post.findById(postId);

  if (!post) {
    throw new NotFoundError('Post');
  }

  const likeIndex = post.likes.indexOf(userId as any);

  if (likeIndex > -1) {
    // Unlike
    post.likes.splice(likeIndex, 1);
  } else {
    // Like
    post.likes.push(userId as any);

    // Send notification to post author
    const author = await User.findById(post.author);
    if (author && author.deviceToken) {
      const liker = await User.findById(userId);
      await notificationService.sendNotification(author.deviceToken, {
        title: 'New Like',
        body: `${liker?.fullName} liked your post`,
        data: {
          postId: post._id.toString(),
          type: 'like',
        },
      });
    }
  }

  await post.save();
  await post.populate('author', 'username fullName profileImage');

  ResponseHandler.success(res, post, likeIndex > -1 ? 'Post unliked successfully' : 'Post liked successfully');
});

export const addComment = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AuthenticationError();
  }

  const { postId } = req.params;
  const body = createCommentSchema.parse(req.body);

  const post = await Post.findById(postId);

  if (!post) {
    throw new NotFoundError('Post');
  }

  post.comments.push({
    author: req.user.userId as any,
    content: body.content,
    createdAt: new Date(),
  });

  await post.save();
  await post.populate('author', 'username fullName profileImage');
  await post.populate('comments.author', 'username fullName profileImage');

  // Send notification to post author
  const author = await User.findById(post.author);
  if (author && author.deviceToken && author._id.toString() !== req.user.userId) {
    const commenter = await User.findById(req.user.userId);
    await notificationService.sendNotification(author.deviceToken, {
      title: 'New Comment',
      body: `${commenter?.fullName} commented on your post`,
      data: {
        postId: post._id.toString(),
        type: 'comment',
      },
    });
  }

  ResponseHandler.success(res, post, 'Comment added successfully');
});

export const deleteComment = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AuthenticationError();
  }

  const { postId, commentId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new NotFoundError('Post');
  }

  const commentIndex = post.comments.findIndex((c) => c._id.toString() === commentId);

  if (commentIndex === -1) {
    throw new NotFoundError('Comment');
  }

  if (post.comments[commentIndex].author.toString() !== req.user.userId) {
    throw new Error('Unauthorized to delete this comment');
  }

  post.comments.splice(commentIndex, 1);

  await post.save();
  await post.populate('author', 'username fullName profileImage');
  await post.populate('comments.author', 'username fullName profileImage');

  ResponseHandler.success(res, post, 'Comment deleted successfully');
});
