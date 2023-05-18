import { BigNumber, utils, Contract } from 'ethers';
import { DEFAULT_GAS_LIMIT, approve } from './general';
import { Box } from '@chakra-ui/react';
import type { AbiItem } from 'web3-utils';
import multicalcontract from '../abis/Multicall.json';
import Web3 from 'web3';
import { useEffect, useState } from 'react';

const web3 = new Web3('https://rpc.ftm.tools/');

export default function Test() {
  const [bondingCurveData, setBondingCurveData] = useState(null);

  const multicallv3 = async (): Promise<any> => {
    return new web3.eth.Contract(
      multicalcontract.abi as AbiItem[],
      '0x6F67748881DCce8238042370c3f9659379775886',
    );
  };

  const fetchData = async () => {
    const contractInstance = await multicallv3();
    if (contractInstance) {
      contractInstance.methods
        .bondingCurveData('0x992651bde478421Be71475E1d58ed50AD793da0e')
        .call()
        .then(result => {
          setBondingCurveData(result);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  fetchData();

  const getdata = () => {
    console.log(bondingCurveData);
  };

  console.log('hello');
  getdata();

  return (
    <Box>
      <p>
        hello
        {bondingCurveData}
      </p>
    </Box>
  );
}
