import BigNumber from 'bignumber.js';

export interface FarmVote {
  address: string;
  tokens: string[];
  liquidity: string;
  yourVote: string;
  feeEarns: string;
  rewards: string;
  votes: number;
  pid: number;
  fulldata: any;
}

export interface FarmVoteComplete extends FarmVote {
  percent: string;
  votesTotal: string;
}

export interface BribeCard {
  plugin: string;
  bribe: string;
  liquidityPer10kInspirit: number;
  isAlive: boolean;
  protocol: string; // B4
  symbol: string; // B5

  rewardTokens: string[]; // B6
  rewardTokenDecimals: number[]; // B7
  rewardsPerToken: BigNumber[]; // B8
  accountRewardsEarned: BigNumber[];
  voteWeight: BigNumber;
  votePercent: BigNumber;
  accountVotePercent: BigNumber;
}
