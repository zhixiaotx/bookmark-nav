import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 使用相对路径，保证部署到 GitHub Pages 子路径 / Vercel / Cloudflare / Netlify 等都能正常加载
  base: './',
  plugins: [react()],
})