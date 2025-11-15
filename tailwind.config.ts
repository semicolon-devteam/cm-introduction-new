import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Figma Design System Colors (CI Guideline Compliant)
        brand: {
          primary: "#068FFF", // Blue - connection, technology, trust
          white: "#FFFFFF", // Pure white - clarity, simplicity
          black: "#1D242B", // Dark gray-black - professionalism, depth
          surface: "#1A1A1A", // Surface background
        },
        gray: {
          light: "#C7C7C7",
          medium: "#5C5C5C",
          dark: "#999999",
        },
        // Shadcn/ui Original Colors (compatibility)
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
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
      fontSize: {
        // Figma Typography Scale
        "heading-1": ["48px", { lineHeight: "1.5", fontWeight: "700" }],
        "heading-2": ["32px", { lineHeight: "1.193", fontWeight: "700" }],
        "heading-3": ["24px", { lineHeight: "1.5", fontWeight: "700" }],
        "body-1": ["20px", { lineHeight: "1.5", fontWeight: "500" }],
        "body-2": ["16px", { lineHeight: "1.5", fontWeight: "500" }],
        caption: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Figma Border Radius
        4: "4px",
        8: "8px",
        20: "20px",
        50: "50px",
      },
      spacing: {
        // Figma Specific Spacing
        420: "420px",
      },
    },
  },
  plugins: [],
} satisfies Config;
