/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Primary navy palette (header, nav, badges) */
        navy: {
          deep:  '#131921',
          DEFAULT: '#232F3E',
          light: '#37475A',
        },
        /* Action / CTA orange */
        orange: {
          DEFAULT: '#FF9900',
          hover:   '#E68A00',
          light:   '#FFF3CD',
        },
        /* Surfaces */
        surface: {
          DEFAULT: '#F7FAFA',
          dim:     '#D7DBDB',
          card:    '#FFFFFF',
          section: '#EAEDED',
        },
        /* Text */
        ink: {
          DEFAULT: '#181C1D',
          muted:   '#44474C',
          faint:   '#75777C',
        },
        /* Borders */
        border: {
          DEFAULT: '#D5D9D9',
          strong:  '#ADB7B7',
        },
      },
      fontFamily: {
        sans:      ['Inter', 'system-ui', 'sans-serif'],
        headline:  ['Work Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['40px', { lineHeight: '48px', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg':     ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md':     ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm':     ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md':    ['14px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0.02em' }],
        'label-sm':    ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      borderRadius: {
        sm:  '0.125rem',
        DEFAULT: '0.25rem',
        md:  '0.375rem',
        lg:  '0.5rem',
        xl:  '0.75rem',
      },
      spacing: {
        xs:  '8px',
        sm:  '12px',
        md:  '16px',
        lg:  '24px',
        xl:  '32px',
      },
      maxWidth: {
        content: '1500px',
      },
      boxShadow: {
        card:    '0 1px 3px 0 rgba(35,47,62,0.10)',
        'card-hover': '0 4px 12px 0 rgba(35,47,62,0.15)',
        dropdown: '0 8px 20px 0 rgba(35,47,62,0.12)',
        modal:   '0 12px 40px 0 rgba(35,47,62,0.18)',
      },
    },
  },
  plugins: [],
}
