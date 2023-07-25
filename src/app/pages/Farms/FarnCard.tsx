import { useState, useEffect, useMemo } from 'react';
import { default as TokenCard } from './Tokens/farmTokens';

import { Button } from '@chakra-ui/react';
import useWallets from 'app/hooks/useWallets';

import gaugeContract from 'utils/web3/abis/gauge.json';
import underlyingContract from 'utils/web3/abis/underlying.json';
import pluginContract from 'utils/web3/abis/plugin.json';

import Web3 from 'web3';
import type { AbiItem } from 'web3-utils';

const FarnCard = ({ data }) => {
  const { account } = useWallets();

  let web3 = new Web3(window.ethereum);

  const gasLimit = 500000;

  let tvl = data[11] / 1e18;
  let stakedTokens = data[13] / 1e18;
  let votingWeight = data[12] / 1e18;

  let stakedTokens1 = data[15] / 1e18;
  let stakedTokens2 = (data[15] * data[8]) / 1e36;

  let rewards1 = data[16] / 1e18;
  let rewards2 = (data[16] * data[9]) / 1e36;

  let gaugeAddress = data[3];
  let pluginAddress = data[0];
  let underlyingAddress = data[1];

  console.log(data[0]);
  console.log(data[1]);

  const gauge = async (): Promise<any> => {
    return new web3.eth.Contract(gaugeContract.abi as AbiItem[], gaugeAddress);
  };

  const underlying = async (): Promise<any> => {
    return new web3.eth.Contract(
      underlyingContract.abi as AbiItem[],
      underlyingAddress,
    );
  };

  const plugin = async (): Promise<any> => {
    return new web3.eth.Contract(
      pluginContract.abi as AbiItem[],
      pluginAddress,
    );
  };

  let handleClaim = async () => {
    try {
      const gaugeContractInstance = await gauge();

      let transaction = await gaugeContractInstance.methods
        .getReward(account)
        .send({ from: account, gas: gasLimit });
      console.log('transaction succesful' + transaction);
    } catch (error) {
      console.log('error:' + error);
    }
  };

  let handleDeposit = async () => {
    let plugin = data[0];
    try {
      const underlyingContractInstance = await underlying();
      let transaction = await underlyingContractInstance.methods
        .approve(plugin, account)
        .send({ from: account, gas: gasLimit });
      console.log('transaction succesful' + transaction);
    } catch (error) {
      console.log('error' + error);
    }
    try {
      const pluginContractInstance = await plugin();
      let transaction = pluginContractInstance.methods
        .depositFor(account, 1)
        .send({ from: account, gas: gasLimit });
      console.log('transaction succesful' + transaction);
    } catch (err) {
      console.log('error' + err);
    }
  };

  let handleWithdraw = async () => {
    try {
      const underlyingContractInstance = await underlying();
      const pluginContractInstance = await plugin();

      let transaction = pluginContractInstance.methods
        .depositFor(account, 1)
        .send({ from: account, gas: gasLimit });
      console.log('transaction succesful' + transaction);
    } catch (err) {
      console.log('error' + err);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h6>{data[5]}</h6>
        <h6>{data[6]}</h6>

        <TokenCard tokens={data[7]} />

        <h6>TVL: ${tvl}</h6>
        <h6>Staked Tokens: ${stakedTokens}</h6>
        <h6>Voting weight: ${votingWeight}%</h6>
        <h6></h6>
        <h6>Staked Tokens</h6>
        <h5>{stakedTokens1}</h5>
        <h5>${stakedTokens2}</h5>
        <Button onClick={handleWithdraw}>Withdraw</Button>

        <h6>Rewards</h6>
        <h5>{rewards1}</h5>
        <h5>${rewards2}</h5>
        <Button onClick={handleClaim}>Claim</Button>
        <br></br>
        <br></br>
        <Button>
          <a href="https://curve.fi/#/ethereum/pools">Get</a>
        </Button>
        <Button onClick={handleDeposit}>Deposit </Button>

        <br />
      </div>
    </div>
  );
};

export default FarnCard;
