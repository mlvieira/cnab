import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

const repositoryName = "cnab";

// https://vite.dev/config/
export default defineConfig({
  base: 'cnab/',
  plugins: [
    svelte(),
    tailwindcss()
  ],
})
