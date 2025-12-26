/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Important for the "dark" class in your HTML
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#137fec",
                "background-light": "#f6f7f8",
                "background-dark": "#101922",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
        },
    },
    plugins: [],
}