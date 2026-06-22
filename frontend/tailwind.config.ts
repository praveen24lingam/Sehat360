import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          deepGreen:    '#1A6B4A',
          midGreen:     '#2D9B6F',
          lightGreen:   '#E8F5EE',
          saffron:      '#E8820C',
          saffronLight: '#FEF3E2',
          ink:          '#0F1C14',
          inkSoft:      '#3D5247',
          smoke:        '#F4F8F5',
          card:         '#FFFFFF',
          border:       '#D4E8DC',
          danger:       '#DC2626',
          dangerLight:  '#FEF2F2',
          blue:         '#2563EB',
          blueLight:    '#EFF6FF',
          pink:         '#DB2777',
          pinkLight:    '#FDF2F8',
        },
        // Override Shadcn defaults to match brand
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: '#1A6B4A',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(15, 28, 20, 0.05), 0 1px 2px -1px rgba(15, 28, 20, 0.03)',
        'card-md': '0 8px 24px -4px rgba(15, 28, 20, 0.08), 0 4px 12px -2px rgba(15, 28, 20, 0.04)',
        'card-lg': '0 12px 32px -6px rgba(15, 28, 20, 0.12), 0 8px 16px -4px rgba(15, 28, 20, 0.06)',
        'nav': '0 -1px 0 0 #D4E8DC, 0 -8px 24px -4px rgba(15, 28, 20, 0.04)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'button': '0 4px 12px rgba(26, 107, 74, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'button-active': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #1A6B4A 0%, #2D9B6F 100%)',
        'gradient-radial-premium': 'radial-gradient(circle at top left, rgba(45, 155, 111, 0.15), transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      maxWidth: {
        'shell': '430px',       // Mobile: always 430px
        'shell-tablet': '700px', // Tablet: 700px
        'shell-desktop': '1200px', // Desktop: 1200px
      },
      width: {
        'sidebar': '240px',     // Sidebar width
      },
      spacing: {
        'nav-mobile': '64px',   // Bottom nav height on mobile
        'nav-desktop': '64px',  // Top nav height on desktop
        'sidebar-width': '240px', // Desktop sidebar width
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config