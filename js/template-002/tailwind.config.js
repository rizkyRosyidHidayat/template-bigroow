tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#212121',
        'text-body': '#4c4c4c',
      },
      fontFamily: {
        title: ['"Inria Serif"', 'serif'],
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1280px',
      },
    },
  },
};
