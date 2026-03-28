@echo off
title QuizIT - Dev Server
echo ==========================================
echo    QuizIT - He thong thi trac nghiem
echo ==========================================
echo.

REM Kiem tra thu muc node_modules
if not exist "node_modules\" (
    echo [1/4] Dang cai dat thu vien (npm install)...
    call npm install
) else (
    echo [1/4] Thu vien da duoc cai dat.
)

REM Thiet lap Prisma
echo [2/4] Dang thiet lap co so du lieu (Prisma)...
call npx prisma generate
call npx prisma db push

REM Seed du lieu
echo [3/4] Dang nap du lieu mau (Seed)...
call npx tsx seed.ts

REM Khoi dong server
echo [4/4] Dang khoi dong server Next.js...
echo.
echo URL: http://localhost:3000
echo Admin: admin@quizit.com / admin123
echo.
call npm run dev
