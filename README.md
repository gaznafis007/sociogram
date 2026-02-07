# Sociogram Backend

A production-grade social media backend API built with Node.js, Express, and TypeScript. Features include user authentication with JWT, real-time notifications via Firebase Cloud Messaging, and a comprehensive REST API for social interactions.

## 🎯 Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Post Management**: Create, read, update, and delete posts (text-only)
- **Social Interactions**: Like/unlike posts and add comments
- **Push Notifications**: Real-time notifications via Firebase Cloud Messaging
- **User Search**: Search users by username or full name
- **API Documentation**: Auto-generated Swagger documentation
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Request Validation**: Input validation using Zod schemas
- **Modular Architecture**: Clean, maintainable code structure

## 🛠 Tech Stack

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Notifications**: Firebase Cloud Messaging
- **Validation**: Zod
- **API Documentation**: Swagger/OpenAPI
- **Development**: ts-node, TypeScript compiler

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0 or yarn >= 3.0.0
- MongoDB instance (local or cloud)
- Firebase project with service account

## 🚀 Getting Started

### 1. Install Dependencies

```bash
yarn install
# or
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000

# Database
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/sociogram

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d

# Firebase (Optional - use one of the methods below)
# Method 1: Service Account JSON (base64 encoded)
FIREBASE_SERVICE_ACCOUNT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Method 2: Firebase environment variables
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
```

### 3. Start Development Server

```bash
yarn dev
```

The server will start on `http://localhost:5000` and API documentation will be available at `http://localhost:5000/api-docs`.

### 4. Build for Production

```bash
yarn build
yarn start
```

## 📚 API Documentation

Full API documentation is available at `/api-docs` when the server is running.

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/profile` | Get user profile | ✅ |
| PUT | `/api/auth/profile` | Update user profile | ✅ |
| PUT | `/api/auth/device-token` | Update device token for notifications | ✅ |
| GET | `/api/auth/users/:username` | Get user profile by username | ❌ |
| GET | `/api/auth/search` | Search users | ❌ |

### Posts Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/posts` | Create new post | ✅ |
| GET | `/api/posts` | Get posts feed | ❌ |
| GET | `/api/posts/:postId` | Get specific post | ❌ |
| PUT | `/api/posts/:postId` | Update post | ✅ |
| DELETE | `/api/posts/:postId` | Delete post | ✅ |
| POST | `/api/posts/:postId/like` | Like/unlike post | ✅ |
| POST | `/api/posts/:postId/comment` | Add comment to post | ✅ |
| DELETE | `/api/posts/:postId/comment/:commentId` | Delete comment | ✅ |

## 🔐 Authentication

The API uses Bearer Token authentication. Include your JWT token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Example: Getting Your Profile

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer your-jwt-token"
```

## 📊 Database Schema

### User Collection

```typescript
{
  username: string (unique, lowercase, 3-30 chars)
  email: string (unique, lowercase)
  password: string (hashed with bcrypt)
  fullName: string (max 100 chars)
  bio?: string (max 500 chars)
  profileImage?: string (URL)
  deviceToken?: string (for push notifications)
  createdAt: Date
  updatedAt: Date
}
```

### Post Collection

```typescript
{
  author: ObjectId (references User)
  content: string (1-5000 chars)
  tags?: string[] (array of tags)
  likes: ObjectId[] (array of user IDs)
  comments: [{
    author: ObjectId (references User)
    content: string (max 1000 chars)
    createdAt: Date
  }]
  createdAt: Date
  updatedAt: Date
}
```

## 🧪 Example Requests

### Sign Up

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "fullName": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Create Post

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is my first post!",
    "tags": ["social", "app"]
  }'
```

### Like a Post

```bash
curl -X POST http://localhost:5000/api/posts/postId123/like \
  -H "Authorization: Bearer your-jwt-token"
```

### Add Comment

```bash
curl -X POST http://localhost:5000/api/posts/postId123/comment \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great post!"
  }'
```

## 🏗 Project Structure

```
src/
├── config/          # Configuration files (database, firebase, swagger)
├── controllers/     # Business logic controllers
├── middleware/      # Express middleware (auth, validation, error handling)
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── services/        # External services (auth, password, notifications)
├── types/           # TypeScript interfaces and types
├── utils/           # Utility functions (logger, validators, errors, response)
├── app.ts           # Express app setup
└── index.ts         # Server entry point

dist/               # Compiled JavaScript (generated after build)
```

## ✅ Code Quality

- **Type Safety**: Full TypeScript support with strict mode
- **Error Handling**: Custom error classes and global error handler
- **Validation**: Zod schemas for request validation
- **Logging**: Structured logger for debugging
- **DRY Principles**: Reusable services, middleware, and utilities
- **Modular Design**: Separation of concerns with clear responsibilities

## 🔄 Request/Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "timestamp": "2024-02-08T10:30:00.000Z"
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Feeds retrieved successfully",
  "data": [ /* array of items */ ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "timestamp": "2024-02-08T10:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "timestamp": "2024-02-08T10:30:00.000Z"
}
```

## 🔔 Firebase Cloud Messaging Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Generate a service account key:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file
4. Encode the JSON content in base64 and set as `FIREBASE_SERVICE_ACCOUNT` environment variable

## 🚀 Deployment

### Using Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t sociogram-backend .
docker run -p 5000:5000 --env-file .env sociogram-backend
```

### Using PM2 (Production Process Manager)

```bash
npm install -g pm2
npm run build
pm2 start dist/index.js --name "sociogram-api"
pm2 save
pm2 startup
```

## 📝 Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn build` - Compile TypeScript to JavaScript
- `yarn start` - Start production server
- `yarn type-check` - Check TypeScript types without emitting
- `yarn lint` - Run ESLint (when configured)
- `yarn format` - Format code with Prettier (when configured)

## 🐛 Error Handling

The API includes comprehensive error handling for:

- **400 Bad Request**: Validation errors, invalid input
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Duplicate resource (email/username)
- **500 Internal Server Error**: Unexpected server errors

## 📞 Support

For issues or questions:
1. Check the API documentation at `/api-docs`
2. Review the error messages in the response
3. Check the server logs for detailed information

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ for production-grade applications**
