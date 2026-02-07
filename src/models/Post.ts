import { Schema, model, Document } from 'mongoose';

export interface ICommentDocument {
  author: Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface IPostDocument extends Document {
  author: Schema.Types.ObjectId;
  content: string;
  tags?: string[];
  likes: Schema.Types.ObjectId[];
  comments: ICommentDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<ICommentDocument>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment author is required'],
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      minlength: [1, 'Comment cannot be empty'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const postSchema = new Schema<IPostDocument>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post author is required'],
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      minlength: [1, 'Post content cannot be empty'],
      maxlength: [5000, 'Post content cannot exceed 5000 characters'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      lowercase: true,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
      index: true,
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ tags: 1 });

// Virtuals for counts
postSchema.virtual('likeCount').get(function (this: IPostDocument) {
  return this.likes.length;
});

postSchema.virtual('commentCount').get(function (this: IPostDocument) {
  return this.comments.length;
});

// Ensure virtuals are included when converting to JSON
postSchema.set('toJSON', { virtuals: true });

export const Post = model<IPostDocument>('Post', postSchema);
