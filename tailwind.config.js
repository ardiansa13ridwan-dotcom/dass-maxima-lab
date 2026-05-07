/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        biruKlinik: "#1e3a8a",
        biruMuda: "#dbeafe"
      }
    },
  },
  plugins: [],
}