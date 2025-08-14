#!/bin/bash

echo "🚀 WhatsApp Clone Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v16 or higher."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed. Please install git."
        exit 1
    fi
    
    print_status "All requirements are met!"
}

# Install backend dependencies
setup_backend() {
    print_status "Setting up backend..."
    cd backend
    
    if [ ! -f ".env" ]; then
        print_warning "Creating .env file from template..."
        cp env.example .env
        print_warning "Please edit backend/.env with your configuration:"
        print_warning "  - MONGODB_URI: Your MongoDB Atlas connection string"
        print_warning "  - WEBHOOK_VERIFY_TOKEN: Your WhatsApp webhook verify token"
        print_warning "  - JWT_SECRET: A secure random string"
    fi
    
    print_status "Installing backend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_status "Backend setup completed!"
    else
        print_error "Backend setup failed!"
        exit 1
    fi
    
    cd ..
}

# Install frontend dependencies
setup_frontend() {
    print_status "Setting up frontend..."
    cd frontend
    
    if [ ! -f ".env" ]; then
        print_warning "Creating .env file from template..."
        cp env.example .env
        print_warning "Please edit frontend/.env with your configuration:"
        print_warning "  - REACT_APP_API_URL: Your backend API URL"
        print_warning "  - REACT_APP_SOCKET_URL: Your backend Socket.IO URL"
    fi
    
    print_status "Installing frontend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_status "Frontend setup completed!"
    else
        print_error "Frontend setup failed!"
        exit 1
    fi
    
    cd ..
}

# Seed database with sample data
seed_database() {
    print_status "Seeding database with sample data..."
    cd backend
    
    if [ -f ".env" ]; then
        print_status "Running database seeder..."
        npm run seed
        
        if [ $? -eq 0 ]; then
            print_status "Database seeding completed!"
        else
            print_warning "Database seeding failed. This might be due to missing MongoDB connection."
        fi
    else
        print_warning "Skipping database seeding - .env file not found"
    fi
    
    cd ..
}

# Build frontend for production
build_frontend() {
    print_status "Building frontend for production..."
    cd frontend
    
    print_status "Running production build..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_status "Frontend build completed!"
        print_status "Build files are in frontend/build/"
    else
        print_error "Frontend build failed!"
        exit 1
    fi
    
    cd ..
}

# Start development servers
start_dev() {
    print_status "Starting development servers..."
    
    # Start backend in background
    print_status "Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend
    print_status "Starting frontend server..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    print_status "Development servers started!"
    print_status "Backend: http://localhost:5000"
    print_status "Frontend: http://localhost:3000"
    print_status ""
    print_warning "Press Ctrl+C to stop all servers"
    
    # Wait for user to stop
    wait
}

# Show deployment instructions
show_deployment_instructions() {
    echo ""
    echo "🌐 Deployment Instructions"
    echo "========================="
    echo ""
    echo "Backend (Render):"
    echo "1. Push your code to GitHub"
    echo "2. Go to https://render.com and create a new Web Service"
    echo "3. Connect your GitHub repository"
    echo "4. Set environment variables in Render dashboard:"
    echo "   - MONGODB_URI: Your MongoDB Atlas connection string"
    echo "   - CORS_ORIGIN: Your frontend URL"
    echo "   - WEBHOOK_VERIFY_TOKEN: Your webhook token"
    echo "   - JWT_SECRET: A secure random string"
    echo "5. Deploy automatically"
    echo ""
    echo "Frontend (Vercel):"
    echo "1. Push your code to GitHub"
    echo "2. Go to https://vercel.com and import your repository"
    echo "3. Set environment variables:"
    echo "   - REACT_APP_API_URL: Your backend Render URL + /api"
    echo "   - REACT_APP_SOCKET_URL: Your backend Render URL"
    echo "4. Deploy automatically"
    echo ""
    echo "MongoDB Atlas:"
    echo "1. Create a free cluster at https://mongodb.com/atlas"
    echo "2. Create a database named 'whatsapp'"
    echo "3. Get your connection string"
    echo "4. Whitelist your IP addresses"
    echo ""
}

# Process real WhatsApp payloads
process_real_payloads() {
    print_status "Processing real WhatsApp payloads..."
    cd backend
    
    if [ -f ".env" ]; then
        print_status "Running payload processor..."
        npm run process-real
        
        if [ $? -eq 0 ]; then
            print_status "Payload processing completed!"
        else
            print_warning "Payload processing failed. This might be due to missing MongoDB connection or incorrect payload format."
        fi
    else
        print_warning "Skipping payload processing - .env file not found"
    fi
    
    cd ..
}

# Test real payloads
test_real_payloads() {
    print_status "Testing real payloads..."
    cd backend
    
    if [ -f ".env" ]; then
        print_status "Running payload tester..."
        npm run test-payloads
        
        if [ $? -eq 0 ]; then
            print_status "Payload testing completed!"
        else
            print_warning "Payload testing failed. This might be due to missing MongoDB connection or incorrect payload format."
        fi
    else
        print_warning "Skipping payload testing - .env file not found"
    fi
    
    cd ..
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo "1. Setup project (install dependencies)"
    echo "2. Seed database with sample data"
    echo "3. Build frontend for production"
    echo "4. Start development servers"
    echo "5. Show deployment instructions"
    echo "6. Process real WhatsApp payloads"
    echo "7. Test real payloads"
    echo "8. Exit"
    echo ""
    read -p "Enter your choice (1-8): " choice
    
    case $choice in
        1)
            check_requirements
            setup_backend
            setup_frontend
            print_status "Project setup completed!"
            ;;
        2)
            seed_database
            ;;
        3)
            build_frontend
            ;;
        4)
            start_dev
            ;;
        5)
            show_deployment_instructions
            ;;
        6)
            process_real_payloads
            ;;
        7)
            test_real_payloads
            ;;
        8)
            print_status "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please try again."
            ;;
    esac
}

# Check if script is run with arguments
if [ $# -eq 0 ]; then
    show_menu
else
    case $1 in
        "setup")
            check_requirements
            setup_backend
            setup_frontend
            ;;
        "seed")
            seed_database
            ;;
        "build")
            build_frontend
            ;;
        "dev")
            start_dev
            ;;
        "deploy-info")
            show_deployment_instructions
            ;;
        "process-payloads")
            process_real_payloads
            ;;
        "test-payloads")
            test_real_payloads
            ;;
        *)
            echo "Usage: $0 [setup|seed|build|dev|deploy-info|process-payloads|test-payloads]"
            echo "Or run without arguments for interactive menu"
            exit 1
            ;;
    esac
fi
