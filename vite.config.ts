import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/Face-AMS/", // 👈 Add your repository name here
  plugins: [react()],
});
