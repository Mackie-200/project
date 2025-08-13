// Frontend Environment Configuration
// Copy the content below to create your .env.local file in the project root

/*
Create a file named ".env.local" in your project root with this content:

VITE_API_URL=https://backend-ej1d.onrender.com/api

*/

// Alternative: You can also set this directly in your vite.config.js
export const API_CONFIG = {
  BACKEND_URL: 'https://backend-ej1d.onrender.com/api'
};

console.log('To connect your frontend to the deployed backend:');
console.log('1. Create .env.local file in project root');
console.log('2. Add: VITE_API_URL=https://backend-ej1d.onrender.com/api');
console.log('3. Restart your dev server: npm run dev');
