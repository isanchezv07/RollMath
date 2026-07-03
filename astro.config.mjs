// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    devToolbar: {
        enabled: false,
    },
    server: {
        host: true, // Enable access from local network
        port: 4321,
        allowedHosts: true, // Allow all hosts (for Localtunnel, etc.)
        watch: {
          ignored: ['**/server/**'],
        },
    },
    vite: {
        plugins: [tailwindcss()],
    },
});
