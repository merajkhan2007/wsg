import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['var(--font-montserrat)', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: "#E94E77",    // Soft Pink-Red
          secondary: "#FFB3C1",  // Light Pink
          accent: "#F6A623",     // Warm Orange
          base: "#FFF7F9",       // Very Light Pink
          dark: "#2C2C2C",       // Dark Gray
        },
        surface: {
          light: "#FFF7F9",
          DEFAULT: "#ffffff",
          dark: "#f9f0f2",
        }
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(135deg, #E94E77 0%, #FFB3C1 100%)',
      },
      boxShadow: {
        'soft': '0 4px 15px rgba(233, 78, 119, 0.08)',
        'glow': '0 0 20px rgba(233, 78, 119, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'soft-bounce': 'softBounce 3s ease-in-out infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        softBounce: {
          '0%, 100%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(-8px)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
