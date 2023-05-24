import { AbiItem } from 'web3-utils';
import multicalcontract from '../abis/Multicall.json';
import Web3 from 'web3';

const web3 = new Web3('https://rpc.ftm.tools/');

export const Test = async () => {
  const multicallv3 = new web3.eth.Contract(
    multicalcontract.abi as AbiItem[],
    '0x6F67748881DCce8238042370c3f9659379775886',
  );

  try {
    const result = await multicallv3.methods
      .bondingCurveData('0x992651bde478421Be71475E1d58ed50AD793da0e')
      .call();

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
