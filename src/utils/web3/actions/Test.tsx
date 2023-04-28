import { BigNumber, utils, Contract } from 'ethers';
import { DEFAULT_GAS_LIMIT, approve } from './general';
import { Box } from '@chakra-ui/react';
import type { AbiItem } from 'web3-utils';
import multicalcontract from '../abis/Multicall.json';
import Web3 from 'web3';
import { useEffect, useState } from 'react';

const web3 = new Web3('http://localhost:8545');

export default function Test() {
  const [bondingCurveData, setBondingCurveData] = useState(null);

  const multicallv3 = async (): Promise<any> => {
    return new web3.eth.Contract(
      multicalcontract.abi as AbiItem[],
      '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F',
    );
  };

  const fetchData = async () => {
    const contractInstance = await multicallv3();
    if (contractInstance) {
      contractInstance.methods
        .getname()
        .call({ from: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' })
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
