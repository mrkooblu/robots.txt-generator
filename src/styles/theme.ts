export const lightTheme = {
  colors: {
    primary: '#3B82F6',
    secondary: '#1D4ED8',
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      card: '#FFFFFF',
      allow: 'rgba(16, 185, 129, 0.1)', // Light green for Allow
      disallow: 'rgba(239, 68, 68, 0.1)', // Light red for Disallow
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
    },
    border: '#E5E7EB',
    hover: '#2563EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  fonts: {
    family: {
      primary: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
  },
  heading: {
    h1: {
      fontSize: '40px',
      lineHeight: '52px',
      fontWeight: 800,
    },
    h2: {
      fontSize: '30px',
      lineHeight: '34px',
      fontWeight: 800,
    },
    h3: {
      fontSize: '28px',
      lineHeight: '34px',
      fontWeight: 700,
    },
    h4: {
      fontSize: '22px',
      lineHeight: '31px',
      fontWeight: 900,
    },
    body: {
      fontSize: '18px',
      lineHeight: '32px',
      fontWeight: 400,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    card: '0 2px 8px rgba(0, 0, 0, 0.08)',
    hover: '0 4px 12px rgba(0, 0, 0, 0.12)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  transition: {
    default: '0.2s ease-in-out',
  },
};

// Export both as named export and default export for backward compatibility
export const theme = lightTheme;
export default lightTheme; 