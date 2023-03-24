/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: { ...colors, primary: '#5c6ac4', secondary: '#f6ad55' },
		},
	},
	plugins: [],
};
