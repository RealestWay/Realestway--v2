import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    navy: Palette['primary'];
  }
  interface PaletteOptions {
    navy?: PaletteOptions['primary'];
  }
}

/**
 * Designer colour palette (from attached swatches)
 *
 * Green scale
 *   Light        #e6f6ee  rgb(230,246,238)
 *   Light:hover  #d9f1e6  rgb(217,241,230)
 *   Light:active #b0e2cb  rgb(176,226,203)
 *   Normal       #00a256  rgb(0,162,86)        ← primary.main
 *   Normal:hover #00924d  rgb(0,146,77)        ← primary.dark
 *   Normal:active#008245  rgb(0,130,69)
 *   Dark         #007a41  rgb(0,122,65)
 *   Dark:hover   #006134  rgb(0,97,52)
 *   Dark:active  #004927  rgb(0,73,39)
 *   Darker       #00391e  rgb(0,57,30)
 *
 * Neutral / grey scale
 *   Light        #e6e6e6  rgb(230,230,230)
 *   Light:hover  #d9d9d9  rgb(217,217,217)
 *   Light:active #b0b0b0  rgb(176,176,176)
 *   Normal       #ffffff  rgb(255,255,255)
 *   Normal:hover #e6e6e6  rgb(230,230,230)
 *   Normal:active#cccccc  rgb(204,204,204)
 *   Dark         #bfbfbf  rgb(191,191,191)
 *   Dark:hover   #999999  rgb(153,153,153)
 *   Dark:active  #737373  rgb(115,115,115)
 *   Darker       #595959  rgb(89,89,89)
 *
 * Black scale
 *   Light        #e6e6e6  rgb(230,230,230)
 *   Light:hover  #d9d9d9  rgb(217,217,217)
 *   Light:active #b0b0b0  rgb(176,176,176)
 *   Normal       #000000  rgb(0,0,0)
 *
 * Font scale (designer spec)
 *   3.833rem → h1   (≈ 92px)
 *   3.083rem → h2   (≈ 74px)
 *   2.458rem → h3   (≈ 59px)
 *   1.958rem → h4   (≈ 47px)
 *   1.583rem → h5   (≈ 38px)
 *   1.250rem → h6   (≈ 30px)
 *   1.000rem → body1 (24px)
 *   0.792rem → caption (19px)
 */

const PRIMARY_MAIN = '#00a256';
const PRIMARY_DARK = '#00924d';
const PRIMARY_DEEPER = '#007a41';
const PRIMARY_DARKEST = '#00391e';
const PRIMARY_LIGHT = '#e6f6ee';
const PRIMARY_LIGHT_HOVER = '#d9f1e6';

const NEUTRAL_DARK = '#595959';
const NEUTRAL_DARKER = '#000000';

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: PRIMARY_MAIN,
      light: '#33b877',
      dark: PRIMARY_DARK,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#100073',
      light: '#3D338F',
      dark: '#0B0051',
      contrastText: '#FFFFFF',
    },
    navy: {
      main: '#100073',
      light: '#3D338F',
      dark: '#0B0051',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F6F7FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: NEUTRAL_DARKER,
      secondary: NEUTRAL_DARK,
    },
    success: {
      main: PRIMARY_MAIN,
      light: '#33b877',
      dark: PRIMARY_DEEPER,
    },
    grey: {
      50:  '#ffffff',
      100: '#e6e6e6',
      200: '#d9d9d9',
      300: '#b0b0b0',
      400: '#bfbfbf',
      500: '#999999',
      600: '#737373',
      700: '#595959',
      800: '#333333',
      900: '#000000',
    },
    divider: 'rgba(0,0,0,0.07)',
  },

  typography: {
    fontFamily: '"Poppins", "Helvetica Neue", "Arial", sans-serif',

    /* Designer font scale */
    h1: {
      fontFamily: '"Poppins", "Arial Black", sans-serif',
      fontWeight: 900,
      fontSize: '3.833rem',   // ~92px
      letterSpacing: '-0.025em',
      lineHeight: 1.1,
    },
    h2: {
      fontFamily: '"Poppins", "Arial Black", sans-serif',
      fontWeight: 800,
      fontSize: '3.083rem',   // ~74px
      letterSpacing: '-0.015em',
    },
    h3: {
      fontFamily: '"Poppins", "Arial Black", sans-serif',
      fontWeight: 800,
      fontSize: '2.458rem',   // ~59px
    },
    h4: {
      fontFamily: '"Poppins", "Arial Black", sans-serif',
      fontWeight: 700,
      fontSize: '1.958rem',   // ~47px
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
      fontSize: '1.583rem',   // ~38px
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
      fontSize: '1.250rem',   // ~30px
    },
    subtitle1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '0.875rem',
    },
    body1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 400,
      fontSize: '1rem',       // 24px in designer spec mapped to 1rem body
    },
    body2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
    },
    button: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 400,
      fontSize: '0.792rem',   // ~19px
    },
    overline: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.1em',
      fontSize: '0.75rem',
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
        },
        sizeLarge: {
          padding: '14px 32px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8125rem',
        },
        containedPrimary: {
          backgroundColor: PRIMARY_MAIN,
          '&:hover': {
            backgroundColor: PRIMARY_DARK,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 14 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: '0 1px 0 rgba(0,0,0,0.08)' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 600,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: '"Poppins", sans-serif',
          borderRadius: 6,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontFamily: '"Poppins", sans-serif',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4 },
      },
    },
  },
});

export default theme;
