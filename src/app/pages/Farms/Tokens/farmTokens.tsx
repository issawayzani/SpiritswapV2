import React from 'react';
import FTM from '../../../../../public/images/tokens/FTM.png';

// 0x7FE495D9ff5860839951C05C1C4f8ee4e78C5c53 TEST0

//0x280357C11c920f070CA36A7018AFab62a7C1C2E6 TEST1

//"0x7FE495D9ff5860839951C05C1C4f8ee4e78C5c53" TEST0
//"0xAa171Ad6f4eD52ED74707300aD90bDAEE8398773" BASE

//0x280357C11c920f070CA36A7018AFab62a7C1C2E6
//0xAa171Ad6f4eD52ED74707300aD90bDAEE8398773
//TEST1/BASE

//0xAa171Ad6f4eD52ED74707300aD90bDAEE8398773
//GAME0

//0xAa171Ad6f4eD52ED74707300aD90bDAEE8398773
//GAME1

const farmTokens = props => {
  let tokenArr = {
    TEST0: FTM,
    TEST1: FTM,
    BASE: FTM,
  };

  let token0, token1;

  switch (props.tokens[0]) {
    case '0x7FE495D9ff5860839951C05C1C4f8ee4e78C5c53':
      token0 = tokenArr.TEST0;
      break;
    case '0x280357C11c920f070CA36A7018AFab62a7C1C2E6':
      token0 = tokenArr.TEST1;
      break;
    case '0xAa171Ad6f4eD52ED74707300aD90bDAEE8398773':
      token0 = tokenArr.BASE;
      break;
    default:
      token0 = tokenArr.BASE;
      break;
  }

  if (props.tokens.length == 2) {
    switch (props.tokens[1]) {
      case '0x7FE495D9ff5860839951C05C1C4f8ee4e78C5c53':
        token1 = tokenArr.TEST0;
        break;
      case '0x280357C11c920f070CA36A7018AFab62a7C1C2E6':
        token1 = tokenArr.TEST1;
        break;
      case '0xAa171Ad6f4eD52ED74707300aD90bDAEE8398773':
        token1 = tokenArr.BASE;
        break;
      default:
        break;
    }
  }

  return (
    <>
      <img src={token0} alt="Token 1" />;
      {token1 && <img src={token1} alt="Token 2" />}
    </>
  );
};

export default farmTokens;
