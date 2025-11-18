/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chatBg: "#f5f7fb",
        bubbleMe: "#4f46e5",
        bubbleOther: "#e5e7eb",
      },
    },
  },
  plugins: [],
};
