import { AbiItem } from 'web3-utils';
import multicalcontract from '../abis/Multicall.json';
import wrappedFTM from '../abis/fakeBASE.json';
import Web3 from 'web3';
import { DEFAULT_GAS_LIMIT, approve } from './general';
import { buyToken } from './inspirit';
import { ethers } from 'ethers';
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import useWallets from 'app/hooks/useWallets';
const web3 = new Web3('https://rpc.ftm.tools/');

export const Test = async (
  account,
  input: null | undefined | string,
  slippage: null | undefined | number,
) => {
  const multicallv3 = new web3.eth.Contract(
    multicalcontract.abi as AbiItem[],
    '0xa871fD92a8f055141F1f53Ba6758BA61d87Fe1E8',
  );

  try {
    const result = await multicallv3.methods.bondingCurveData(account).call();

    let quoteBuyIn = null;
    let quoteBuyOut = null;
    let quoteSellIn = null;
    let quoteSellOut = null;
    if (input != null && slippage != null) {
      const number1 = parseUnits(input);

      quoteBuyIn = await multicallv3.methods
        .quoteBuyIn(number1, slippage)
        .call();
      quoteBuyOut = await multicallv3.methods
        .quoteBuyOut(number1, slippage)
        .call();
      quoteSellIn = await multicallv3.methods
        .quoteSellIn(number1, slippage)
        .call();
      quoteSellOut = await multicallv3.methods
        .quoteSellOut(number1, slippage)
        .call();
    }

    return { result, quoteBuyIn, quoteBuyOut, quoteSellIn, quoteSellOut };
  } catch (e) {
    console.log(e);
    return null;
  }
};
