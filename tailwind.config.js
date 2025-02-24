/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary:{
          DEFAULT: '#ADD662',
          light: '#DEEDC2',
          dark: ' #8AB43E',
        },
        secondary: {
          DEFAULT: '#57673B', 
          light: '#63802F', 
          dark: '#415027', 
        },
        accent: {
          light: '#F6F6F6', 
          gray:'#767676',
          dark: ' #4D4C4C',
          danger:' #9E2020',
          sucess:' #254E05',
        },
      },
    },
  },
  plugins: [],
}



