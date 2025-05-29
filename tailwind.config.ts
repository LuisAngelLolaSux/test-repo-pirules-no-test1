import colors from "tailwindcss/colors";
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindScrollbar from "tailwind-scrollbar";
import tailwindcssBgPatterns from "tailwindcss-bg-patterns";
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./contexts/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      patterns: {
        opacities: {
          100: "1",
          80: ".80",
          60: ".60",
          40: ".40",
          20: ".20",
          10: ".10",
          5: ".05",
        },
        sizes: {
          1: "0.25rem",
          2: "0.5rem",
          4: "1rem",
          6: "1.5rem",
          8: "2rem",
          16: "4rem",
          20: "5rem",
          24: "6rem",
          32: "8rem",
        },
      },
      backgroundSize: {
        "size-200": "200% 200%",
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
        "pos-100": "100% 100%",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "phone-background": "url('/main-page/phoneBackground.svg')",
      },
      screens: {
        "2xl": "1400px",
        "3xl": "2500px",
      },
      colors: {
        ...colors,
        "primary-lola": "#33A64B",
        "primary-lola-ldark": "#286735",
        "primary-lola-dark": "#373C37",
        "primary-lola-xdark": "#2C2C2C",
        "primary-lola-light": "#34C85A",
        "primary-lola-xlight": "#33D563",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        lola: "20px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "float-in-place": {
          "0%, 100%": {
            transform: "translateY(0))",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0) rotate(-10deg)",
          },
          "50%": {
            transform: "translateY(-10px) rotate(-10deg)",
          },
        },
        "inverse-float": {
          "0%, 100%": {
            transform: "translateY(0) rotate(-10deg)",
          },
          "50%": {
            transform: "translateY(10px) rotate(10deg)",
          },
        },
        "inverse-float-left": {
          "0%, 100%": {
            transform: "translateX(0) rotate(5deg)",
          },
          "50%": {
            transform: "translateX(-10px) rotate(-5deg)",
          },
        },
        "fade-from-bottom": {
          "0%": {
            opacity: "0",
            transform: "translateY(50px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slower": "spin 45s linear infinite",
        float: "float 3s ease-in-out infinite",
        "inverse-float": "inverse-float 5s ease-in-out infinite",
        "inverse-float-left": "inverse-float-left 7s ease-in-out infinite",
        "fade-from-bottom": "fade-from-bottom 2s ease-out",
        "float-in-place": "float-in-place 3s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindScrollbar, tailwindcssBgPatterns],
} satisfies Config;

export default config;
