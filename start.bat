@echo off
REM Запускаем Django backend
start cmd /k "cd C:\Users\Esentur\Desktop\Debtbook\debtbook && ..\env\Scripts\activate && python manage.py runserver"

REM Запускаем React frontend
start cmd /k "cd C:\Users\Esentur\Desktop\Debtbook\debtbook-frontend && npm start"

REM Ждём 5 секунд, чтобы frontend успел подняться
timeout /t 5 >nul

REM Открываем браузер
start http://localhost:3000
