import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
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
		accent: {
		  DEFAULT: "hsl(var(--accent))",
		  foreground: "hsl(var(--accent-foreground))",
		},
		destructive: {
		  DEFAULT: "hsl(var(--destructive))",
		  foreground: "hsl(var(--destructive-foreground))",
		},
		border: "hsl(var(--border))",
		input: "hsl(var(--input))",
		ring: "hsl(var(--ring))",
		muted: {
		  DEFAULT: "hsl(var(--muted))",
		  foreground: "hsl(var(--muted-foreground))",
		},
	  }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config;
