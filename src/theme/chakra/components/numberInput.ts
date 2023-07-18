import { colors } from '../../base/color';
import { borderRadius } from '../../base/borderRadius';
import { fontSize } from '../../base/fontSize';

const numberInput = {
  parts: ['addon', 'field', 'element'],
  baseStyle: {
    field: {
      bg: 'rgba(29.49, 26.39, 89.25, 0.90)',
      color: '#A9CDFF',
      borderRadius: borderRadius.sm,
      border: '1px solid #2E2A8C',
      p: 'spacing02 0',
      pr: '0',
      w: {
        base: '170px',
        md: '270px',
      },
      _focus: {
        border: '1px solid #2E2A8C',
        borderColor: '#2E2A8C',
      },
      _invalid: {
        borderColor: 'error',
      },
    },
  },

  sizes: {},

  variants: {
    default: {
      field: {
        fontSize: fontSize.xl2,
      },
    },
    primary: {
      size: 'lg',
      field: {
        bg: 'rgba(29.49, 26.39, 89.25, 0.90)',
        border: '1px solid #2E2A8C',
        borderColor: '#2E2A8C',
      },
    },
    noBorder: {
      field: {
        border: 'none',
      },
    },
  },

  defaultProps: {
    variant: 'default',
  },
};

export default numberInput;
