export const colorValues = {
  teal: {
    ciTrans15: '#7974D3',
    400: '#7974D3', //hover
    600: '#32CEC0', //click
    800: '#7974D3',
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
    100: '#100F3A',
    200: '#100F3A',
    500: '#100F3A',
    600: '#100F3A',
    700: '#100F3A',
    800: '#100F3A',
    900: '#100F3A',
  },
  blue: {
    900: '#100F3A',
  },
};

const { blue, gray, red, teal, yellow } = colorValues;

export const colors = {
  white: gray.white,
  ciTrans15: teal.ciTrans15,
  ci: '#9747FF',
  ciDark: '#100F3A',
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
  gray: '#100F3A',
  grayDarker: '#100F3A',
  grayBorderBox: '#100F3A',
  bgInput: '#100F3A',
  grayBorderToggle: '#100F3A',
  bgBoxLighter: '#100F3A',
  bgBox: '#100F3A',
  bgBoxDarker: '#100F3A',
  bgDark: '#100F3A',
  secondary: '#100F3A',
  errorNotification: '#4F1621',
  defaultNotification: '#284E51',
  bgReset: '#2E2A8C',
  greenBorder: '#22ABAC',
};
