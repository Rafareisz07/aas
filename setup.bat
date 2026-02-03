@echo off
echo Limpando instalação anterior...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo Instalando dependências...
call npm install react react-dom react-scripts
call npm install -D tailwindcss@3.2.4 postcss@8.4.21 autoprefixer@10.4.13
call npm install react-router-dom

echo Criando arquivos de configuração...

echo. > tailwind.config.js
(
echo /** @type {import('tailwindcss').Config} */
echo module.exports = {
echo   content: [
echo     "./src/**/*.{js,jsx,ts,tsx}",
echo   ],
echo   theme: {
echo     extend: {},
echo   },
echo   plugins: [],
echo }
) > tailwind.config.js

echo. > postcss.config.js
(
echo module.exports = {
echo   plugins: {
echo     tailwindcss: {},
echo     autoprefixer: {},
echo   },
echo }
) > postcss.config.js

echo Configuração concluída!
echo Execute: npm start
pause