@echo off
echo 🏏 Setting up Cricket Scoring App...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Create .env file for backend if it doesn't exist
if not exist "backend\.env" (
    echo 🔧 Creating backend .env file...
    (
        echo MONGODB_URI=mongodb://localhost:27017/cricket-scoring
        echo REDIS_URL=redis://localhost:6379
    ) > backend\.env
    echo ✅ Created backend\.env file
) else (
    echo ✅ Backend .env file already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Make sure MongoDB is running on localhost:27017
echo 2. Make sure Redis is running on localhost:6379
echo 3. Run 'npm run dev' to start the application
echo 4. Open http://localhost:3000 in your browser
echo.
echo 🏏 Happy Cricket Scoring!
pause 