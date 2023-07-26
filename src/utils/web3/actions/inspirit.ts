import addresses from 'constants/contracts';
import { BigNumber, utils } from 'ethers';
import { BigNumber as BigNum } from '@ethersproject/bignumber';
import { CHAIN_ID } from 'constants/index';
import { DEFAULT_GAS_LIMIT, approve } from './general';
import type { AbiItem } from 'web3-utils';
import { Contract } from '../contracts';
import { gaugeContractProxy } from './farm';
import { transactionResponse } from './utils';
import { wallet } from 'utils/web3';
import { isPossibleToVote } from 'utils/data';
import { ERROR_NOT_SUM_100 } from 'constants/errors';
import { getProvider } from 'app/connectors/EthersConnector/login';
import { BribeCard } from 'app/interfaces/Inspirit';
import moment from 'moment';

export const getGaugeV2Contract = async (_provider = null) => {
  const gaugeV2Address = addresses.gaugeV3[CHAIN_ID];

  if (!_provider) {
    const provider = getProvider();
    return await Contract(gaugeV2Address, 'gaugeproxyV3', provider);
  }
  // Contract (addresses.mulltiCall,'Multicall',provider);
  return await Contract(
    gaugeV2Address,
    'gaugeproxyV3',
    undefined,
    undefined,
    _provider,
  );
};
export const getGaugeStableContract = async (_provider = null) => {
  const gaugeStableAddress = addresses.stableProxy[CHAIN_ID];
  if (!_provider) {
    const provider = getProvider();
    return await Contract(gaugeStableAddress, 'stableproxy', provider);
  }

  return await Contract(
    gaugeStableAddress,
    'stableproxy',
    undefined,
    undefined,
    _provider,
  );
};

export const getBribeContract = async (
  bribeAddress: string,
  provider: any = null,
) => {
  return await Contract(
    bribeAddress,
    'bribe',
    undefined,
    undefined,
    provider,
    true,
  );
};

export const getGaugeV2Address = async (
  lpAddress: string,
  version: number,
  provider: any = null,
) => {
  if (version === 3) {
    const gaugeStableContract = await getGaugeStableContract(provider);
    return await gaugeStableContract.getGauge(lpAddress);
  }
  const gaugeV2Contract = await getGaugeV2Contract(provider);
  return await gaugeV2Contract.getGauge(lpAddress);
};

export const getBribeAddress = async (
  gaugeAddress: string,
  version: number,
  provider: any = null,
) => {
  try {
    if (version === 3) {
      const gaugeStableContract = await getGaugeStableContract(provider);
      return await gaugeStableContract.bribes(gaugeAddress);
    }
    const gaugeV2Contract = await getGaugeV2Contract(provider);
    return await gaugeV2Contract.bribes(gaugeAddress);
  } catch (error) {}
};

export const getBribeContractByLpAddress = async (
  lpAddress: string,
  version: number,
  provider: any = null,
) => {
  const gaugeAddress = await getGaugeV2Address(lpAddress, version, provider);
  const bribeAddress = await getBribeAddress(gaugeAddress, version, provider);
  const bribeContract = await getBribeContract(bribeAddress, provider);
  return bribeContract;
};

export const submitBribe = async (
  bribeAddress: string,
  tokenAddress: string,
  amount: BigNumber,
) => {
  const connector = getProvider();
  const { signer } = await wallet(connector);
  const bribeContract = await getBribeContract(bribeAddress, signer);
  return await bribeContract.notifyRewardAmount(tokenAddress, amount, {
    gasLimit: DEFAULT_GAS_LIMIT,
  });
};

// export const claimBribes = async (
//   bribes: string[],
//   userAddress: string,
//   version,
// ) => {
//   if (version === 0) {
//     const gaugeStableContract = await getGaugeStableContract();
//     return await gaugeStableContract.claimBribes(bribes, userAddress, {
//       gasLimit: DEFAULT_GAS_LIMIT,
//     });
//   }
//   const gaugeV2Contract = await getGaugeV2Contract();

//   return await gaugeV2Contract.claimBribes(bribes, userAddress, {
//     gasLimit: DEFAULT_GAS_LIMIT,
//   });
// };

export const feeDistributorContract = async () => {
  const _connector = getProvider();
  const feeDistributorContract = await Contract(
    addresses.feedistributor[CHAIN_ID],
    'feedistributor',
    _connector,
    CHAIN_ID,
  );

  return feeDistributorContract;
};

export const inspiritContract = async () => {
  const _connector = getProvider();
  const inspiritContract = await Contract(
    addresses.inspirit[CHAIN_ID],
    'inspirit',
    _connector,
    CHAIN_ID,
  );

  return inspiritContract;
};

export const bribeContract = async address => {
  const _connector = getProvider();
  const bribeContract = await Contract(address, 'bribe', _connector, CHAIN_ID);

  return bribeContract;
};
export const createBribe = async (bribeAddress, tokenAddress, number) => {
  const contract = await bribeContract(bribeAddress);
  return await contract.notifyRewardAmount(tokenAddress, number);
};
export const voterContract = async () => {
  const _connector = getProvider();
  const tokenContract = await Contract(
    '0x6cC3217Eed6d45497b0f566522C36927da108321',
    'voter',
    _connector,
    CHAIN_ID,
  );

  return tokenContract;
};
export const vote = async (plugins, weights) => {
  const contract = await voterContract();
  return await contract.vote(plugins, weights);
};
export const reset = async () => {
  const contract = await voterContract();
  return await contract.reset();
};
export const checkLastVoted = async userAddress => {
  const contract = await multicallContract();
  let userNumber;
  try {
    userNumber = await contract.bondingCurveData(userAddress);
  } catch (e) {
    console.log(e);
    return true;
  }
  const number = userNumber.accountLastVoted;
  const currentUnixTime = Math.floor(Date.now() / 1000);
  const value = Math.floor(currentUnixTime / 604800) * 604800;
  if (Number(number) > value) {
    return false;
  } else {
    return true;
  }
};

export const claimBribes = async bribes => {
  const contract = await voterContract();
  return await contract.claimBribes(bribes);
};
export const TokenContract = async () => {
  const _connector = getProvider();
  const tokenContract = await Contract(
    '0x8d6abe4176f262F79317a1ec60B9C6e070a2142a',
    'token',
    _connector,
    CHAIN_ID,
  );

  return tokenContract;
};
export const getTokenSymbol = async address => {
  const _connector = getProvider();
  const tokenContract = await Contract(address, 'erc20', _connector, CHAIN_ID);
  const symbol = await tokenContract.symbol();
  return symbol;
};

export const multicallContract = async () => {
  const _connector = getProvider();
  const multicallContract = await Contract(
    '0xa871fD92a8f055141F1f53Ba6758BA61d87Fe1E8',
    'Multicall',
    _connector,
    CHAIN_ID,
  );

  return multicallContract;
};
export const getBondingCurveData = async userAddress => {
  const contract = await multicallContract();
  const data = await contract.bondingCurveData(userAddress);
  return data;
};
export const getVotePageData = async userAddress => {
  const contract = await multicallContract();
  const data = await contract.bondingCurveData(userAddress);
  const accountVTOKEN = data.accountVTOKEN;
  const accounVotingPower = data.accountVotingPower;
  return { accountVTOKEN, accounVotingPower };
};

export const getBribeCards = async userAddress => {
  const contract = await multicallContract();
  const totalpools = await contract.getPlugins();
  return await contract.getBribeCards(0, totalpools.length, userAddress);
};
export const VTOKENContract = async () => {
  const _connector = getProvider();
  const tokenContract = await Contract(
    '0x0a5D71AbF79daaeE3853Db43c1Fb9c20195585f9',
    'VTOKEN',
    _connector,
    CHAIN_ID,
  );

  return tokenContract;
};

export const VTOKENRewarderContract = async () => {
  const _connector = getProvider();
  const tokenContract = await Contract(
    '0xc759291f52cA29d754cb071Cc7BC41F3E029b045',
    'VTOKENRewarder',
    _connector,
    CHAIN_ID,
  );

  return tokenContract;
};
export const getReward = async userAddress => {
  const contract = await VTOKENRewarderContract();
  return await contract.getReward(userAddress);
};
export const deposit = async amount => {
  const contract = await VTOKENContract();
  return await contract.deposit(amount);
};
export const withdraw = async amount => {
  const contract = await VTOKENContract();
  return await contract.withdraw(amount);
};
export const burn = async (userAddress, amount) => {
  const contract = await VTOKENContract();
  return await contract.burnFor(userAddress, amount);
};

export const buyToken = async (output, minOutput, deadline, userAddress) => {
  const contract = await TokenContract();
  const currentUnixEpochTime = Date.now();
  const timeStamp = currentUnixEpochTime + deadline * 60;
  return await contract.buy(
    output,
    minOutput,
    timeStamp,
    userAddress,
    '0x992651bde478421Be71475E1d58ed50AD793da0e',
  );
};
export const sellToken = async (output, minOutput, deadline, userAddress) => {
  const contract = await TokenContract();
  const currentUnixEpochTime = Date.now();
  const timeStamp = currentUnixEpochTime + deadline * 60;
  return await contract.sell(
    output,
    minOutput,
    timeStamp,
    userAddress,
    '0x992651bde478421Be71475E1d58ed50AD793da0e',
  );
};
export const borrow = async amount => {
  const contract = await TokenContract();
  return await contract.borrow(amount);
};
export const repay = async amount => {
  const contract = await TokenContract();
  return await contract.repay(amount);
};
export const exercise = async (amount, userAddress) => {
  const contract = await TokenContract();
  return await contract.exercise(amount, userAddress);
};
export const redeem = async (amount, userAddress) => {
  const contract = await TokenContract();
  return await contract.redeem(amount, userAddress);
};

export const approveSpirit = async (
  _address: string,
  _allowableAmount: string,
  _callback?: Function | undefined,
  _chainId = CHAIN_ID,
) => {
  if (!_allowableAmount) {
    throw new Error('Allowable amount needs to be provided');
  }
  const lockAmount = utils.parseEther(`${_allowableAmount}`);

  const tx = await approve(
    addresses.spirit[_chainId],
    _address,
    lockAmount,
    'spirit',
    _chainId,
  );

  return transactionResponse('inspirit.allowance', {
    tx: tx,
    uniqueMessage: { text: 'Approving', secondText: 'SPIRIT' },
    update: 'allowances',
    updateTarget: 'user',
  });
};

// lockEnd = milliseconds in unixTime
export const createInspiritLock = async (
  _userAddress: string,
  _lockAmount: number | string,
  _lockEnd: number | undefined, // timestamp
) => {
  if (!_lockEnd) {
    throw new Error('Invalid lock time selected');
  }

  if (!_lockAmount) {
    throw new Error('Invalid lock amount');
  }
  const contract = await inspiritContract();

  // Check the current amount locked
  const lockedAmount = await contract.locked(_userAddress, {
    gasLimit: DEFAULT_GAS_LIMIT,
  });

  if (!lockedAmount.amount.eq(0)) {
    throw new Error('Existing lock already tied to account');
  }

  const tx = await contract.create_lock(
    utils.parseEther(`${_lockAmount}`),
    _lockEnd,
    {
      gasLimit: DEFAULT_GAS_LIMIT,
    },
  );

  return transactionResponse('inspirit.lock', {
    tx: tx,
    inputSymbol: 'SPIRIT',
    inputValue: _lockAmount.toString(),
    update: 'portfolio',
    updateTarget: 'user',
  });
};

export const increaseLockAmount = async (
  _address: string,
  _amount: number | string,
) => {
  if (!_amount) {
    throw new Error('Invalid additional amount to lock');
  }

  const contract = await inspiritContract();

  // Check the current amount locked
  const lockedAmount = await contract.locked(_address, {
    gasLimit: DEFAULT_GAS_LIMIT,
  });

  if (lockedAmount.amount.eq(0)) {
    throw new Error('Address does not have existing lock amount');
  }

  const lockAmount = utils.parseEther(`${_amount}`);

  const tx = await contract.increase_amount(lockAmount, {
    gasLimit: DEFAULT_GAS_LIMIT,
  });

  return transactionResponse('inspirit.lock', {
    tx: tx,
    inputSymbol: 'SPIRIT',
    inputValue: _amount.toString(),
    update: 'portfolio',
    updateTarget: 'user',
  });
};

export const increaseLockTime = async (
  _userAddress: string,
  _newTimeStamp: number | undefined,
) => {
  if (!_newTimeStamp) {
    throw new Error('Invalid lock time');
  }

  const nextLockedDate = moment.unix(_newTimeStamp).utc().format('Do MMM YYYY');

  const contract = await inspiritContract();

  // Check the current amount locked
  const lockedAmount = await contract.locked(_userAddress, {
    gasLimit: DEFAULT_GAS_LIMIT,
  });

  if (lockedAmount.amount.eq(0)) {
    throw new Error('Address does not have existing lock amount');
  }

  const tx = await contract.increase_unlock_time(_newTimeStamp, {
    gasLimit: DEFAULT_GAS_LIMIT,
  });

  return transactionResponse('inspirit.extend', {
    tx: tx,
    uniqueMessage: { text: `Locking until ${nextLockedDate}` },
    update: 'portfolio',
    updateTarget: 'user',
  });
};

export const unlockInspirit = async (amount: string) => {
  const contract = await inspiritContract();
  const tx = await contract.withdraw({
    gasLimit: DEFAULT_GAS_LIMIT,
  });

  return transactionResponse('inspirit.unlock', {
    tx: tx,
    inputSymbol: 'SPIRIT',
    inputValue: amount,
    update: 'portfolio',
    updateTarget: 'user',
  });
};

export const claimSpirit = async (claimableSpiritRewards: string) => {
  const contract = await feeDistributorContract();

  const tx = await contract['claim()']();

  return transactionResponse('inspirit.claim', {
    tx: tx,
    uniqueMessage: {
      text: `Claiming ${parseFloat(claimableSpiritRewards).toPrecision(4)}`,
      secondText: 'SPIRIT',
    },
    update: 'portfolio',
    updateTarget: 'user',
  });
};
//used for voting
// export const voteForBoostedDistributions = async ({
//   vaults,
//   version = 1,
// }: {
//   vaults: BoostedFarm[];
//   version?: number;
// }) => {
//   const tokenList: string[] = [];
//   const valueList: BigNum[] = [];
//   let votingWeight = 0;

//   vaults.forEach(vault => {
//     const { value, fulldata } = vault;
//     const address = fulldata.farmAddress;
//     const weight = parseFloat(`${value}`.replace(' %', ''));

//     if (weight && address) {
//       tokenList.push(address);
//       valueList.push(utils.parseEther(`${weight}`));
//       votingWeight += weight;
//     }
//   });

//   if (votingWeight !== 100 || tokenList.length !== valueList.length) {
//     throw new Error(ERROR_NOT_SUM_100);
//   }

//   const contract = await gaugeContractProxy({ version });

//   const tx = await contract.vote(tokenList, valueList, {
//     gasLimit: DEFAULT_GAS_LIMIT,
//   });

//   return transactionResponse('inspirit.vote', {
//     tx: tx,
//     uniqueMessage: { text: 'Voting for boosted farms ' },
//     update: 'inspirit',
//     updateTarget: 'user',
//   });
// };

export const checkLastVotes = async (
  userAddress: string,
  versionId: number,
): Promise<boolean> => {
  const contract = await gaugeContractProxy({ version: versionId });
  const lastVotes = await contract.lastVote(userAddress);
  const lastVotesNumber = Number(lastVotes.toString());
  const checkLastVote = isPossibleToVote(lastVotesNumber);

  return checkLastVote;
};
