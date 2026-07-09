/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      fontSize: {
        "display": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h1": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h2": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "h3": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "h4": ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
        "h5": ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body": ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        "small": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "caption": ["0.75rem", { lineHeight: "1.5", fontWeight: "400" }],
      },
      colors: {
        // Design tokens mapped to CSS variables
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
          light: "hsl(var(--primary-light))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          light: "hsl(var(--success-light))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          light: "hsl(var(--warning-light))",
          foreground: "hsl(var(--warning-foreground))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          light: "hsl(var(--danger-light))",
          foreground: "hsl(var(--danger-foreground))",
        },
        bg: {
          DEFAULT: "hsl(var(--bg))",
          surface: "hsl(var(--surface))",
          surface2: "hsl(var(--surface-2))",
          elevated: "hsl(var(--elevated))",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          strong: "hsl(var(--border-strong))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          tertiary: "hsl(var(--text-tertiary))",
          inverse: "hsl(var(--text-inverse))",
        },
      },
      borderRadius: {
        "xs": "4px",
        "sm": "8px",
        "md": "12px",
        "lg": "16px",
        "xl": "24px",
        "2xl": "32px",
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
      },
      boxShadow: {
        "none": "none",
        "xs": "0 1px 2px 0 hsl(220 14% 10% / 0.04)",
        "sm": "0 1px 3px 0 hsl(220 14% 10% / 0.08), 0 1px 2px -1px hsl(220 14% 10% / 0.04)",
        "md": "0 4px 6px -1px hsl(220 14% 10% / 0.08), 0 2px 4px -2px hsl(220 14% 10% / 0.04)",
        "lg": "0 10px 15px -3px hsl(220 14% 10% / 0.08), 0 4px 6px -4px hsl(220 14% 10% / 0.04)",
        "focus": "0 0 0 3px hsl(var(--primary) / 0.15)",
      },
      transitionDuration: {
        "fast": "150ms",
        "normal": "200ms",
        "slow": "250ms",
      },
      transitionTimingFunction: {
        "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
      },
      maxWidth: {
        "container": "1280px",
      },
      height: {
        "btn-sm": "36px",
        "btn-md": "44px",
        "btn-lg": "52px",
        "navbar": "72px",
        "input": "48px",
      },
      backdropBlur: {
        "navbar": "12px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "skeleton-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0, 0, 0.2, 1) forwards",
        "fade-in": "fade-in 0.3s cubic-bezier(0, 0, 0.2, 1) forwards",
        "skeleton": "skeleton-pulse 1.5s ease-in-out infinite",
        "spin-slow": "spin-slow 1s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
