const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...fontFamily.sans],
      },
      borderRadius: {
        DEFAULT: "8px",
        secondary: "4px",
        container: "12px",
        'fresh-sm': 'var(--fresh-radius-sm)',
        'fresh': 'var(--fresh-radius)',
        'fresh-lg': 'var(--fresh-radius-lg)',
        'fresh-xl': 'var(--fresh-radius-xl)',
      },
      borderWidth: {
        'fresh-thin': 'var(--fresh-button-border-thin)',
        'fresh-thick': 'var(--fresh-button-border-thick)',
      },
      boxShadow: {
        DEFAULT: "0 1px 4px rgba(0, 0, 0, 0.1)",
        hover: "0 2px 8px rgba(0, 0, 0, 0.12)",
        'fresh-sm': 'var(--fresh-shadow-sm)',
        'fresh': 'var(--fresh-shadow-md)',
        'fresh-lg': 'var(--fresh-shadow-lg)',
        'fresh-xl': 'var(--fresh-shadow-xl)',
      },
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
        },
        secondary: {
          DEFAULT: "#6B7280",
          hover: "#4B5563",
        },
        accent: {
          DEFAULT: "#8B5CF6",
          hover: "#7C3AED",
        },
        // FRESH Design System Colors
        'fresh-primary': 'var(--fresh-primary)',
        'fresh-primary-foreground': 'var(--fresh-primary-foreground)',
        'fresh-primary-hover': 'var(--fresh-primary-hover)',
        'fresh-accent': 'var(--fresh-accent)',
        'fresh-accent-foreground': 'var(--fresh-accent-foreground)',
        'fresh-accent-hover': 'var(--fresh-accent-hover)',
        'fresh-secondary': 'var(--fresh-secondary)',
        'fresh-secondary-foreground': 'var(--fresh-secondary-foreground)',
        'fresh-secondary-hover': 'var(--fresh-secondary-hover)',
        'fresh-success': 'var(--fresh-success)',
        'fresh-success-foreground': 'var(--fresh-success-foreground)',
        'fresh-warning': 'var(--fresh-warning)',
        'fresh-warning-foreground': 'var(--fresh-warning-foreground)',
        'fresh-error': 'var(--fresh-error)',
        'fresh-error-foreground': 'var(--fresh-error-foreground)',
        'fresh-selection-bg': 'var(--fresh-selection-bg)',
        'fresh-selection-border': 'var(--fresh-selection-border)',
        'fresh-selection-yellow': 'var(--fresh-selection-yellow)',
      },
      spacing: {
        "form-field": "16px",
        section: "32px",
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["hover", "active"],
    },
  },
};
