import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
    include: ["__tests__/**/*.test.{js,jsx}"],
    server: {
      deps: {
        // Виджет поставляется ES-модулем, который сам импортирует свой CSS:
        // без пропуска через Vite Node не сможет его загрузить
        inline: ["@hexlet/chatbot-v2"],
      },
    },
  },
});
