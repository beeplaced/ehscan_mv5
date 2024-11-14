import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
dotenv.config({ path: '../ehscan_env/.env' });

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5682,
  },
  define: {
  'process.env': process.env
  }
});


// import legacy from '@vitejs/plugin-legacy'
// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite'

// import dotenv from 'dotenv';
// dotenv.config({ path: '../ehscan_env/.env' });

// // https://vitejs.dev/config/
// export default defineConfig({
//   base: '/',
//   plugins: [
//     react(),
//     legacy()
//   ],
//   server: {
//     port: 5682, // Ensure this port is consistent
//     strictPort: true, // Enforce the use of the specified port
//     hmr: {
//       overlay: false // Ensure this matches the server port
//     }
//   },
//   define: {
//   'process.env': process.env
//   }
// })