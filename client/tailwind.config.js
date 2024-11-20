import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },

  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        jmp: {
          primary: '#ef4444',
          secondary: '#000',
          accent: '#fff',
          neutral: '#fff',
          'base-100': '#ffffff',
        },
      },
    ],
  },
}
