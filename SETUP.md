# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

## ⚡ Quick Start (Windows)

### Option 1: Using the batch file
```bash
# Double-click deploy.bat or run in command prompt
deploy.bat
```

### Option 2: Using npm scripts
```bash
# Install all dependencies
npm run install:all

# Setup environment files
# Edit backend/env.example → backend/.env
# Edit frontend/env.example → frontend/.env

# Start development servers
npm run dev
```

## ⚡ Quick Start (Mac/Linux)

### Option 1: Using the shell script
```bash
# Make script executable and run
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Using npm scripts
```bash
# Install all dependencies
npm run install:all

# Setup environment files
# Edit backend/env.example → backend/.env
# Edit frontend/env.example → frontend/.env

# Start development servers
npm run dev
```

## 🔧 Manual Setup

### 1. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your MongoDB connection string
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp env.example .env
# Edit .env with your backend URLs
npm start
```

## 🌐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp
WEBHOOK_VERIFY_TOKEN=your_webhook_token
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📱 Access the App
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Health Check: http://localhost:5000/health

## 🗄️ Database Seeding
```bash
cd backend
npm run seed
```

## 🚀 Production Build
```bash
npm run build
```

## 📚 Full Documentation
See [README.md](README.md) for complete documentation and deployment instructions.
