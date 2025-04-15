import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Isso permite que o servidor aceite conexões de qualquer IP
    port: 3000,        // Você pode escolher outra porta, se necessário
    open: true,        // Isso abre o navegador automaticamente ao rodar o servidor
  },
})
