/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      "dark-1" :"#292e48",
      "light-1":"#f2f2f2",
      "expense-light":"#FB8500",
      "income-light":"#219EBC",
      "income-dark":"#023047",
      "third":"#292A2C"
      },
    }
  },
  plugins: [],
}