export const colorValues = {
  teal: {
    ciTrans15: 'rgba(100, 221, 192, 0.15)',
    400: '#60E6C5',
    600: '#1D9384',
    800: '#1D353D',
  },
  red: {
    dangerBg: 'rgba(240, 19, 19, 0.15)',
    200: '#FE9A9A',
    400: '#FF6060',
    500: '#F82F2F',
    800: '#321623',
  },
  yellow: {
    warningBgTrans15: 'rgba(234, 179, 8, 0,15)',
    500: '#EAB308',
    800: '#312E22',
  },
  gray: {
    white: '#FFFFFF',
    100: '#D1D5DB',
    200: '#9CA3AF',
    500: '#374151',
    600: '#1F2937',
    700: '#17202F',
    800: '#101726',
    900: '#0D1321',
  },
  blue: {
    900: '#100F3A',
  },
};

const { blue, gray, red, teal, yellow } = colorValues;

export const colors = {
  white: gray.white,
  ciTrans15: teal.ciTrans15,
  ci: teal[400],
  ciDark: teal[600],
  dangerBg: red.dangerBg,
  danger: red[500],
  dangerLight: red[200],
  dangerBorder: red[400],
  warningBg: yellow.warningBgTrans15,
  warning: yellow[500],
  pendingBg: yellow[800],
  successBg: teal[800],
  error: red[500],
  errorBg: red[800],
  disclaimerBg: yellow[800],
  gray: gray[100],
  grayDarker: gray[200],
  grayBorderBox: gray[500],
  bgInput: gray[600],
  grayBorderToggle: gray[600],
  bgBoxLighter: gray[700],
  bgBox: gray[800],
  bgBoxDarker: gray[900],
  bgDark: blue[900],
  secondary: colorValues.gray[500],
  errorNotification: '#4F1621',
  defaultNotification: '#284E51',
};
