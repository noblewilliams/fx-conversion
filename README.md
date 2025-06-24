# FX Conversion Hub

A modern, fullstack foreign exchange conversion application built with Next.js, Express.js, and TypeScript. This application provides real-time currency conversion, transaction tracking, and analytics dashboard.

## 🛠 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Git

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   PORT=8000
   NODE_ENV=development
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRATION=7d
   FRONTEND_URL=http://localhost:3001
   ```

4. **Set up database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The backend will be running on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The frontend will be running on `http://localhost:3001`
