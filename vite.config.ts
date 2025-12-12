import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ваш ключ
const MY_API_KEY = "AIzaSyAcdI154HAGRfXm721SqhDDrnKLEfcDEww";

export default defineConfig({
  plugins: [react()],
  define: {
    // Vite автоматически заменит это на строку ключа при сборке
    'process.env.API_KEY': JSON.stringify(MY_API_KEY),
    'process.env': {},
    'process': {} 
  }
});