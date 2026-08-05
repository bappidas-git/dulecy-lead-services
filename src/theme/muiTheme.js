/* ============================================
   MUI Theme Configuration — Dulcey Design System
   Dulcey Lead Services
   "Beyond Business Support"
   ============================================ */

import { createTheme, alpha } from '@mui/material/styles';

// Color palette — Dulcey ink / red.
// Matches the tokens in src/styles/variables.css.
const colors = {
  primary: {
    main: '#0B0B0C',
    light: '#2A2A2E',
    dark: '#0B0B0C',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#D5192E',
    light: '#F0293E',
    dark: '#A80E1E',
    contrastText: '#FFFFFF',
  },
  // Dulcey red — primary CTA buttons and key highlights.
  accent: {
    main: '#D5192E',
    light: '#F0293E',
    dark: '#A80E1E',
    contrastText: '#FFFFFF',
    50: '#FDECEE',
    100: '#FAD1D6',
    200: '#F3A6AF',
    300: '#EC7382',
    400: '#F0293E',
    500: '#D5192E',
    600: '#A80E1E',
    700: '#870A17',
    800: '#660711',
    900: '#45040B',
  },
  // Legacy alias — many components still reference `palette.orange.*`.
  // Mapped to Dulcey red so CTAs render correctly without sweeping renames.
  orange: {
    main: '#D5192E',
    light: '#F0293E',
    dark: '#A80E1E',
    50: '#FDECEE',
    100: '#FAD1D6',
    200: '#F3A6AF',
    300: '#EC7382',
    400: '#F0293E',
    500: '#D5192E',
    600: '#A80E1E',
    700: '#870A17',
    800: '#660711',
    900: '#45040B',
  },
  // Legacy alias — `palette.navy.*` now resolves to the Dulcey ink ramp.
  navy: {
    main: '#0B0B0C',
    light: '#2A2A2E',
    dark: '#0B0B0C',
    50: '#F5F5F6',
    100: '#E7E7EA',
    200: '#C9C9CE',
    300: '#8B8B92',
    400: '#6B6B70',
    500: '#4A4A4F',
    600: '#3A3A3E',
    700: '#2A2A2E',
    800: '#1A1A1D',
    900: '#0B0B0C',
  },
  success: {
    main: '#1E8E5A',
    light: '#4FB07F',
    dark: '#13683F',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#E0A100',
    light: '#F0C24A',
    dark: '#B07E00',
    contrastText: '#0B0B0C',
  },
  error: {
    main: '#D5192E',
    light: '#F0293E',
    dark: '#A80E1E',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#0B0B0C',
    light: '#2A2A2E',
    dark: '#0B0B0C',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#FAFAFB',
    100: '#F8F8F9',
    200: '#F5F5F6',
    300: '#E7E7EA',
    400: '#8B8B92',
    500: '#6B6B70',
    600: '#4A4A4F',
    700: '#3A3A3E',
    800: '#2A2A2E',
    900: '#0B0B0C',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
    dark: '#0B0B0C',
    light: '#F5F5F6',
  },
  text: {
    primary: '#0B0B0C',
    secondary: '#4A4A4F',
    disabled: '#8B8B92',
    dark: '#0B0B0C',
    light: '#FFFFFF',
  },
  iconColors: {
    gold: '#0B0B0C',
    green: '#1E8E5A',
    purple: '#6B3FA0',
    orange: '#D5192E',
    pink: '#D5192E',
    red: '#D5192E',
    teal: '#0B0B0C',
    blue: '#0B0B0C',
  },
  cardBg: {
    yellow: '#FDECEE',
    green: '#F5F5F6',
    pink: '#FDECEE',
    purple: '#F5F5F6',
    orange: '#FDECEE',
    blue: '#F5F5F6',
  },
};

// Brand gradients — mirror `--grad` / `--grad-text` in variables.css.
const gradients = {
  brand: 'linear-gradient(135deg, #E8293E 0%, #A80E1E 100%)',
  brandReverse: 'linear-gradient(135deg, #A80E1E 0%, #E8293E 100%)',
  text: 'linear-gradient(120deg, #E8293E, #A80E1E)',
};

// Breakpoints matching CSS variables
const breakpoints = {
  values: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1440,
  },
};

// Typography configuration — Archivo everywhere, Instrument Serif for the
// italic display accents used in the mockup.
// The leading 'Inter' is not a second typeface: it is loaded as a one-glyph
// subset scoped to `unicode-range: U+2e` so the full stop renders round
// instead of Archivo's square. Mirrors --font-primary in variables.css.
const FONT_SANS = "'Inter', 'Archivo', system-ui, sans-serif";
const FONT_SERIF = "'Instrument Serif', serif";

const typography = {
  fontFamily: FONT_SANS,
  fontFamilyHeading: FONT_SANS,
  fontFamilySerif: FONT_SERIF,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  fontWeightExtraBold: 800,
  h1: {
    fontFamily: FONT_SANS,
    fontWeight: 700,
    fontSize: 'clamp(2.5rem, 2rem + 2.5vw, 4.5rem)',
    lineHeight: 1.04,
    letterSpacing: '-0.035em',
    color: colors.primary.main,
  },
  h2: {
    fontFamily: FONT_SANS,
    fontWeight: 700,
    fontSize: 'clamp(2rem, 1.5rem + 2.5vw, 3rem)',
    lineHeight: 1.06,
    letterSpacing: '-0.03em',
    color: colors.primary.main,
  },
  h3: {
    fontFamily: FONT_SANS,
    fontWeight: 700,
    fontSize: 'clamp(1.75rem, 1.4rem + 1.75vw, 2.5rem)',
    lineHeight: 1.15,
    letterSpacing: '-0.025em',
    color: colors.primary.main,
  },
  h4: {
    fontFamily: FONT_SANS,
    fontWeight: 700,
    fontSize: 'clamp(1.5rem, 1.25rem + 1.25vw, 2rem)',
    lineHeight: 1.25,
    letterSpacing: '-0.02em',
    color: colors.primary.main,
  },
  h5: {
    fontFamily: FONT_SANS,
    fontWeight: 600,
    fontSize: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
    lineHeight: 1.3,
    letterSpacing: '-0.02em',
    color: colors.primary.main,
  },
  h6: {
    fontFamily: FONT_SANS,
    fontWeight: 600,
    fontSize: 'clamp(1.1rem, 1rem + 0.5vw, 1.25rem)',
    lineHeight: 1.4,
    letterSpacing: '-0.02em',
    color: colors.primary.main,
  },
  subtitle1: {
    fontFamily: FONT_SANS,
    fontWeight: 500,
    fontSize: '1.125rem',
    lineHeight: 1.5,
    color: colors.text.secondary,
  },
  subtitle2: {
    fontFamily: FONT_SANS,
    fontWeight: 500,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    color: colors.text.secondary,
  },
  body1: {
    fontFamily: FONT_SANS,
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: 1.625,
    color: colors.text.primary,
  },
  body2: {
    fontFamily: FONT_SANS,
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    color: colors.text.secondary,
  },
  button: {
    fontFamily: FONT_SANS,
    fontWeight: 600,
    fontSize: '0.9375rem',
    lineHeight: 1,
    textTransform: 'none',
    letterSpacing: '0.025em',
  },
  caption: {
    fontFamily: FONT_SANS,
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 1.5,
    color: colors.text.secondary,
  },
  overline: {
    fontFamily: FONT_SANS,
    fontWeight: 600,
    fontSize: '0.75rem',
    lineHeight: 1.5,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: colors.secondary.main,
  },
};

// Shadows configuration
const shadows = [
  'none',
  '0 1px 2px rgba(0, 0, 0, 0.05)',
  '0 1px 3px rgba(0, 0, 0, 0.1)',
  '0 4px 6px rgba(0, 0, 0, 0.05)',
  '0 4px 8px rgba(0, 0, 0, 0.08)',
  '0 4px 12px rgba(0, 0, 0, 0.08)',
  '0 4px 20px rgba(0, 0, 0, 0.08)',
  '0 8px 16px rgba(0, 0, 0, 0.1)',
  '0 8px 24px rgba(0, 0, 0, 0.1)',
  '0 8px 30px rgba(0, 0, 0, 0.12)',
  '0 12px 40px rgba(0, 0, 0, 0.12)',
  '0 12px 48px rgba(0, 0, 0, 0.15)',
  '0 16px 56px rgba(0, 0, 0, 0.15)',
  '0 16px 64px rgba(0, 0, 0, 0.18)',
  '0 20px 72px rgba(0, 0, 0, 0.18)',
  '0 20px 80px rgba(0, 0, 0, 0.2)',
  '0 24px 88px rgba(0, 0, 0, 0.2)',
  '0 24px 96px rgba(0, 0, 0, 0.22)',
  '0 28px 104px rgba(0, 0, 0, 0.22)',
  '0 28px 112px rgba(0, 0, 0, 0.24)',
  '0 32px 120px rgba(0, 0, 0, 0.24)',
  '0 32px 128px rgba(0, 0, 0, 0.26)',
  '0 36px 136px rgba(0, 0, 0, 0.26)',
  '0 36px 144px rgba(0, 0, 0, 0.28)',
  '0 40px 152px rgba(0, 0, 0, 0.28)',
];

// Red shadow for CTA buttons and highlights.
// Legacy exports kept as `orangeShadow*` / `amberShadow*` so existing imports keep working.
const orangeShadow = '0 10px 26px rgba(213, 25, 46, 0.35)';
const orangeShadowHover = '0 14px 34px rgba(213, 25, 46, 0.38)';
const amberShadow = orangeShadow;
const amberShadowHover = orangeShadowHover;

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    grey: colors.grey,
    background: colors.background,
    text: colors.text,
    accent: colors.accent,
    orange: colors.orange,
    navy: colors.navy,
    iconColors: colors.iconColors,
    cardBg: colors.cardBg,
    divider: colors.grey[300],
    action: {
      active: colors.primary.main,
      hover: alpha(colors.primary.main, 0.06),
      selected: alpha(colors.primary.main, 0.12),
      disabled: colors.grey[400],
      disabledBackground: colors.grey[200],
      focus: alpha(colors.primary.main, 0.12),
    },
  },
  breakpoints,
  typography,
  shadows,
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  zIndex: {
    mobileStepper: 100,
    fab: 105,
    speedDial: 105,
    appBar: 200,
    drawer: 400,
    modal: 600,
    snackbar: 800,
    tooltip: 900,
  },
  components: {
    // Global CSS Baseline
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
        },
        html: {
          scrollBehavior: 'smooth',
          WebkitTextSizeAdjust: '100%',
        },
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          overflowX: 'hidden',
        },
        '::selection': {
          backgroundColor: colors.accent.main,
          color: colors.background.default,
        },
        '::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '::-webkit-scrollbar-track': {
          background: colors.grey[200],
          borderRadius: 4,
        },
        '::-webkit-scrollbar-thumb': {
          background: colors.primary.main,
          borderRadius: 4,
          '&:hover': {
            background: colors.primary.dark,
          },
        },
      },
    },
    // Button Component
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: '12px 24px',
          fontWeight: 600,
          fontSize: '0.9375rem',
          textTransform: 'none',
          transition: 'all 0.25s ease',
          '&:focus-visible': {
            outline: `2px solid ${colors.primary.main}`,
            outlineOffset: 2,
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: shadows[4],
            transform: 'translateY(-2px)',
          },
        },
        // CTA button — Dulcey red gradient with white text.
        containedPrimary: {
          background: gradients.brand,
          color: colors.accent.contrastText,
          boxShadow: amberShadow,
          '&:hover': {
            background: gradients.brandReverse,
            boxShadow: amberShadowHover,
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedSecondary: {
          backgroundColor: colors.primary.main,
          color: colors.background.default,
          '&:hover': {
            backgroundColor: colors.primary.light,
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
        outlinedPrimary: {
          borderColor: colors.primary.main,
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.08),
            borderColor: colors.primary.main,
          },
        },
        outlinedSecondary: {
          borderColor: colors.secondary.main,
          color: colors.secondary.main,
          '&:hover': {
            backgroundColor: alpha(colors.secondary.main, 0.08),
            borderColor: colors.secondary.main,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.08),
          },
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.8125rem',
        },
      },
    },
    // Icon Button
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.25s ease',
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.1),
          },
        },
      },
    },
    // Card Component
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: shadows[6],
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: shadows[9],
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
    // Paper Component
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: shadows[2],
        },
        elevation2: {
          boxShadow: shadows[4],
        },
        elevation3: {
          boxShadow: shadows[6],
        },
      },
    },
    // AppBar Component
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          backgroundImage: 'none',
        },
        colorPrimary: {
          backgroundColor: 'transparent',
        },
      },
    },
    // Toolbar Component
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 80,
          '@media (min-width: 600px)': {
            minHeight: 80,
          },
        },
      },
    },
    // TextField/Input Components
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.25s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.main,
          },
        },
        notchedOutline: {
          borderColor: colors.grey[300],
          transition: 'border-color 0.25s ease',
        },
        input: {
          padding: '14px 16px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.text.secondary,
          '&.Mui-focused': {
            color: colors.primary.main,
          },
        },
      },
    },
    // Select Component
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        select: {
          '&:focus': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    // Menu Component
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: shadows[8],
          marginTop: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.08),
          },
          '&.Mui-selected': {
            backgroundColor: alpha(colors.primary.main, 0.12),
            '&:hover': {
              backgroundColor: alpha(colors.primary.main, 0.16),
            },
          },
        },
      },
    },
    // Chip Component
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
          transition: 'all 0.2s ease',
        },
        filled: {
          '&:hover': {
            boxShadow: shadows[2],
          },
        },
        outlined: {
          borderWidth: 1.5,
        },
        colorPrimary: {
          backgroundColor: colors.primary.main,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: colors.primary.light,
          },
        },
        colorSecondary: {
          backgroundColor: colors.secondary.main,
          color: colors.background.default,
        },
      },
    },
    // Avatar Component
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        colorDefault: {
          backgroundColor: colors.grey[200],
          color: colors.text.primary,
        },
      },
    },
    // Badge Component
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
        },
        colorPrimary: {
          backgroundColor: colors.primary.main,
          color: '#FFFFFF',
        },
      },
    },
    // Tabs Component
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          backgroundColor: colors.primary.main,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 48,
          padding: '12px 24px',
          fontWeight: 600,
          fontSize: '0.9375rem',
          textTransform: 'none',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            color: colors.primary.main,
          },
          '&:hover': {
            color: colors.primary.main,
            opacity: 1,
          },
        },
      },
    },
    // Slider Component
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 6,
          '&.Mui-disabled': {
            color: colors.grey[400],
          },
        },
        track: {
          border: 'none',
          background: `linear-gradient(90deg, ${colors.primary.main}, ${colors.primary.light})`,
        },
        rail: {
          opacity: 0.3,
          backgroundColor: colors.grey[400],
        },
        thumb: {
          width: 20,
          height: 20,
          backgroundColor: colors.primary.main,
          boxShadow: amberShadow,
          '&:hover, &.Mui-focusVisible': {
            boxShadow: amberShadowHover,
          },
          '&:before': {
            display: 'none',
          },
        },
        valueLabel: {
          borderRadius: 8,
          backgroundColor: colors.primary.main,
          '&:before': {
            display: 'none',
          },
        },
        mark: {
          backgroundColor: colors.grey[400],
          width: 4,
          height: 4,
          borderRadius: 2,
        },
        markActive: {
          backgroundColor: colors.primary.light,
        },
      },
    },
    // Switch Component
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 48,
          height: 26,
          padding: 0,
        },
        switchBase: {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(22px)',
            color: colors.background.default,
            '& + .MuiSwitch-track': {
              backgroundColor: colors.primary.main,
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 22,
          height: 22,
          boxShadow: shadows[2],
        },
        track: {
          borderRadius: 13,
          backgroundColor: colors.grey[400],
          opacity: 1,
          transition: 'background-color 0.3s ease',
        },
      },
    },
    // Checkbox Component
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: colors.grey[400],
          '&.Mui-checked': {
            color: colors.primary.main,
          },
        },
      },
    },
    // Radio Component
    MuiRadio: {
      styleOverrides: {
        root: {
          color: colors.grey[400],
          '&.Mui-checked': {
            color: colors.primary.main,
          },
        },
      },
    },
    // Tooltip Component
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.primary.main,
          color: colors.background.default,
          fontSize: '0.8125rem',
          fontWeight: 500,
          padding: '8px 12px',
          borderRadius: 8,
          boxShadow: shadows[4],
        },
        arrow: {
          color: colors.primary.main,
        },
      },
    },
    // Dialog/Modal Component
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: shadows[12],
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          fontWeight: 700,
          fontFamily: typography.fontFamilyHeading,
          padding: '24px 24px 16px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
          gap: 12,
        },
      },
    },
    // Drawer Component
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '24px 24px 0 0',
          boxShadow: shadows[10],
        },
      },
    },
    // Snackbar Component
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: alpha(colors.success.main, 0.12),
          color: colors.success.dark,
        },
        standardError: {
          backgroundColor: alpha(colors.error.main, 0.12),
          color: colors.error.dark,
        },
        standardWarning: {
          backgroundColor: alpha(colors.warning.main, 0.12),
          color: colors.warning.dark,
        },
        standardInfo: {
          backgroundColor: alpha(colors.info.main, 0.12),
          color: colors.info.dark,
        },
      },
    },
    // Accordion Component
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '16px 0',
          minHeight: 'auto',
          '&.Mui-expanded': {
            minHeight: 'auto',
          },
        },
        content: {
          margin: 0,
          '&.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '0 0 16px',
        },
      },
    },
    // Divider Component
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.grey[200],
        },
      },
    },
    // Skeleton Component
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: colors.grey[200],
        },
        rectangular: {
          borderRadius: 8,
        },
      },
    },
    // Backdrop Component
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(colors.primary.main, 0.7),
          backdropFilter: 'blur(4px)',
        },
      },
    },
    // Link Component
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
      styleOverrides: {
        root: {
          color: colors.primary.main,
          fontWeight: 500,
          transition: 'color 0.2s ease',
          '&:hover': {
            color: colors.primary.light,
          },
        },
      },
    },
    // Breadcrumbs Component
    MuiBreadcrumbs: {
      styleOverrides: {
        separator: {
          color: colors.grey[400],
        },
      },
    },
    // Pagination Component
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            fontWeight: 500,
            '&.Mui-selected': {
              backgroundColor: colors.primary.main,
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: colors.primary.light,
              },
            },
          },
        },
      },
    },
    // Table Component
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: colors.grey[200],
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: colors.grey[100],
          color: colors.text.primary,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.04),
          },
        },
      },
    },
    // List Component
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&.Mui-selected': {
            backgroundColor: alpha(colors.primary.main, 0.12),
            '&:hover': {
              backgroundColor: alpha(colors.primary.main, 0.16),
            },
          },
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.08),
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: colors.primary.main,
        },
      },
    },
    // Bottom Navigation Component (Mobile)
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 64,
          backgroundColor: colors.background.default,
          borderTop: `1px solid ${colors.grey[200]}`,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          padding: '8px 12px',
          color: colors.text.secondary,
          '&.Mui-selected': {
            color: colors.primary.main,
          },
        },
        label: {
          fontSize: '0.6875rem',
          fontWeight: 500,
          '&.Mui-selected': {
            fontSize: '0.6875rem',
          },
        },
      },
    },
    // Fab Component
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: amberShadow,
          '&:hover': {
            boxShadow: amberShadowHover,
          },
        },
        primary: {
          background: gradients.brand,
          color: colors.accent.contrastText,
        },
      },
    },
    // Speed Dial Component
    MuiSpeedDial: {
      styleOverrides: {
        fab: {
          background: gradients.brand,
          color: colors.accent.contrastText,
          boxShadow: amberShadow,
          '&:hover': {
            background: gradients.brandReverse,
            boxShadow: amberShadowHover,
          },
        },
      },
    },
    MuiSpeedDialAction: {
      styleOverrides: {
        fab: {
          backgroundColor: colors.background.default,
          color: colors.primary.main,
          boxShadow: shadows[4],
          '&:hover': {
            backgroundColor: colors.grey[100],
          },
        },
      },
    },
  },
});

// Export theme and colors for use in styled components
export { colors, gradients, orangeShadow, orangeShadowHover, amberShadow, amberShadowHover };
export default theme;
