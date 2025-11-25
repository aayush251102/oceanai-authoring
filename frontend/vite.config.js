import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from "fs"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "copy-redirects",
      closeBundle() {
        // Copy _redirects into dist after build
        copyFileSync("_redirects", "dist/_redirects");
      }
    }
  ],
})
