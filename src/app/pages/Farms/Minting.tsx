import { useState, useEffect, useMemo } from 'react';

import { Button } from '@chakra-ui/react';
import useWallets from 'app/hooks/useWallets';

import React from 'react';

import BASEABI from 'utils/web3/abis/BASE.json';
import TEST0ABI from 'utils/web3/abis/TEST0.json';
import TEST1ABI from 'utils/web3/abis/TEST1.json';

import Web3 from 'web3';

import type { AbiItem } from 'web3-utils';

const Minting = () => {
  // const { account } = useWallets();

  const web3 = new Web3(window.ethereum);

  let tokenContracts = {
    BASE: '0xAa171Ad6f4eD52ED74707300aD90bDAEE8398773',
    TEST0: '0x7FE495D9ff5860839951C05C1C4f8ee4e78C5c53',
    TEST1: '0x280357C11c920f070CA36A7018AFab62a7C1C2E6',
  };

  const BASE = async (): Promise<any> => {
    return new web3.eth.Contract(BASEABI.abi as AbiItem[], tokenContracts.BASE);
  };
  const TEST0 = async (): Promise<any> => {
    return new web3.eth.Contract(
      TEST0ABI.abi as AbiItem[],
      tokenContracts.TEST0,
    );
  };
  const TEST1 = async (): Promise<any> => {
    return new web3.eth.Contract(
      TEST1ABI.abi as AbiItem[],
      tokenContracts.TEST1,
    );
  };

  async function connectMetamask() {
    try {
      // Request permission
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Connected to MetaMask!');
    } catch (error) {
      console.error(error);
    }
  }

  let handleMint = async token => {
    let contractInstance;
    const gasLimit = 500000;

    switch (token) {
      case 'BASE':
        try {
          contractInstance = await BASE();
        } catch (error) {
          console.log('Failed to initialize BASE contract instance:', error);
          return; // Return early to avoid executing further code
        }
        break;
      case 'TEST0':
        try {
          contractInstance = await TEST0();
        } catch (error) {
          console.log('Failed to initialize TEST0 contract instance:', error);
          return; // Return early to avoid executing further code
        }
        break;
      case 'TEST1':
        try {
          contractInstance = await TEST1();
        } catch (error) {
          console.log('Failed to initialize TEST1 contract instance:', error);
          return; // Return early to avoid executing further code
        }
        break;
      default:
        contractInstance = null;
        break;
    }

    if (contractInstance) {
      try {
        const accounts = await web3.eth.getAccounts();
        const defaultAccount = accounts[0];

        const result = await contractInstance.methods
          .mint(defaultAccount, 1)
          .send({ from: defaultAccount, gas: gasLimit });

        console.log('worked' + result);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('Wrong token');
    }
  };

  return (
    <>
      {/* <Button onClick={connectMetamask}>Connect Wallet</Button> */}

      <h3>Mint: 1 token </h3>
      <Button onClick={() => handleMint('BASE')}>Base</Button>
      <Button onClick={() => handleMint('TEST0')}>TEST0</Button>
      <Button onClick={() => handleMint('TEST1')}>TEST1</Button>
    </>
  );
};

export default Minting;
