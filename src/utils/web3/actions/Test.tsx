import { AbiItem } from 'web3-utils';
import multicalcontract from '../abis/Multicall.json';
import wrappedFTM from '../abis/fakeBASE.json';
import Web3 from 'web3';
import { DEFAULT_GAS_LIMIT, approve } from './general';
import { buyToken } from './inspirit';
import { ethers } from 'ethers';
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

const web3 = new Web3('https://rpc.ftm.tools/');

export const Test = async (
  account,
  input: null | undefined | string,
  slippage: null | undefined | number,
  check: boolean,
) => {
  const multicallv3 = new web3.eth.Contract(
    multicalcontract.abi as AbiItem[],
    '0xc89CFF765965C76A9775a44775C3f98e5F035a10',
  );

  try {
    const result = await multicallv3.methods.bondingCurveData(account).call();

    let quoteBuyIn = null;
    let quoteBuyOut = null;
    if (input != null && slippage != null) {
      const number1 = parseUnits(input);

      quoteBuyIn = await multicallv3.methods
        .quoteBuyIn(number1, slippage)
        .call();
      quoteBuyOut = await multicallv3.methods
        .quoteBuyOut(number1, slippage)
        .call();
    }

    return { result, quoteBuyIn, quoteBuyOut };
  } catch (error) {
    console.log(error);
    return null;
  }
};
