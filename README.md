# Simple Blog - MERN Stack Application

A full-stack blog application built with MongoDB, Express, React (Next.js), and Node.js.

## Features

- User authentication (register/login)
- Admin dashboard for managing posts
- Rich text editor for creating blog posts
- Image upload support
- Internationalization (i18n) support
- Dark mode support
- Responsive design with Tailwind CSS

## Project Structure

```
simple-blog/
├── client/          # Next.js frontend application
├── server/          # Express.js backend API
└── docker-compose.yml
```

## Prerequisites

- Node.js 20.9.0 or higher
- MongoDB (or use Docker)
- npm or yarn

## Environment Variables

### Server (.env)

Create a `.env` file in the `server` directory:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-blog
JWT_SECRET=supersecretkey
```

### Client (.env.local)

Create a `.env.local` file in the `client` directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_UPLOAD_URL=http://localhost:5000
```

> **Important**: The `NEXT_PUBLIC_*` environment variables are baked into the JavaScript bundle at build time, so you need to rebuild the client after changing them.

## Running Locally (Development)

### Option 1: Run with Docker (Recommended)

This will start MongoDB, the backend server, and the frontend client all at once:

```bash
docker-compose up --build
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

To stop the containers:
```bash
docker-compose down
```

To stop and remove volumes (clean slate):
```bash
docker-compose down -v
```

### Option 2: Run Manually

#### 1. Start MongoDB

Make sure MongoDB is running on `localhost:27017`, or update the `MONGO_URI` in your `.env` file.

#### 2. Start the Backend Server

```bash
cd server
npm install
npm run dev
```

The server will run on http://localhost:5000

#### 3. Start the Frontend Client

```bash
cd client
npm install
npm run dev
```

The client will run on http://localhost:3000

## Admin User Setup

To create an admin user, use the admin tools script:

```bash
# List all users
node ./server/scripts/admin_tools.js list

# Promote a user to admin
node ./server/scripts/admin_tools.js promote <email>
```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/posts` - Get all posts
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts` - Create post (admin only)
- `PUT /api/posts/:slug` - Update post (admin only)
- `DELETE /api/posts/:slug` - Delete post (admin only)
- `POST /api/upload` - Upload image

## Technologies Used

### Frontend
- **Next.js 16** - React framework
- **Tailwind CSS 4** - Styling
- **React Quill** - Rich text editor
- **Axios** - HTTP client
- **next-themes** - Dark mode support

### Backend
- **Express.js 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## License

MIT
