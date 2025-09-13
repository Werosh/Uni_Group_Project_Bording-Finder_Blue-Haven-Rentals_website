import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // 👈 listen on all addresses (0.0.0.0)
    allowedHosts: [
      ".trycloudflare.com", // 👈 allow any Cloudflare tunnel domain
    ],
  },
});
