/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Soft modern SaaS — crisp warm off-white + deep warm charcoal + a
        // confident teal accent that reads premium (not cold corporate, not
        // earthy wellness, not generic). Coral pop for secondary emphasis.
        canvas: {
          50:  "#fcfbf7",
          100: "#f7f5ef",
          200: "#edeae0",
          300: "#dcd7c6",
        },
        char: {
          50:  "#45443f",
          100: "#2a2927",
          200: "#1a1a1c",
          900: "#0a0b0d",
        },
        teal2: {
          50:  "#e8f3f1",
          400: "#1a9389",
          500: "#0f766e",
          600: "#0a5f58",
          700: "#07443f",
        },
        coral: {
          400: "#fa8870",
          500: "#f97057",
          600: "#e55538",
        },
        slate3: {
          400: "#8a897f",
          500: "#64665e",
          600: "#49493f",
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      letterSpacing: { hair: '.22em' },
      boxShadow: {
        card: "0 1px 0 rgba(26,26,28,.03), 0 20px 50px -24px rgba(26,26,28,.14)",
        cta:  "0 2px 0 #07443f, 0 10px 28px -10px rgba(15,118,110,.45)",
        soft: "0 1px 0 rgba(26,26,28,.04), 0 2px 10px -4px rgba(26,26,28,.08)",
      },
    },
  },
  plugins: [],
};
