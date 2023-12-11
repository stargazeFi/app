import { nextui } from '@nextui-org/react'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    fontFamily: {
      heading: ['Bebas Neue', 'sans-serif'],
      body: ['Sapce Mono', 'monospace']
    }
  },
  plugins: [nextui()],
  darkMode: 'class'
}
