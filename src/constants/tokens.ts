import { Token } from 'app/interfaces/General';

export const SOULC = {
  name: 'SoulC',
  symbol: 'SOULC',
  address: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
  chainId: 7700,
  decimals: 18,
};
export const WCANTO = {
  name: 'Wrapped Canto',
  symbol: 'WCANTO',
  address: '0x826551890Dc65655a0Aceca109aB11AbDbD7a07B',
  chainId: 7700,
  decimals: 18,
};

export const WFTM = {
  name: 'Wrapped Fantom',
  symbol: 'WFTM',
  address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  chainId: 250,
  decimals: 18,
};

export const MIM = {
  name: 'Magic Internet Money',
  symbol: 'MIM',
  address: '0x82f0b8b456c1a451378467398982d4834b6829c1',
  chainId: 250,
  decimals: 18,
};

export const FRAX = {
  name: 'Frax',
  symbol: 'FRAX',
  address: '0xdc301622e621166BD8E82f2cA0A26c13Ad0BE355',
  chainId: 250,
  decimals: 18,
};

export const USDC = {
  name: 'USD Coin',
  symbol: 'USDC',
  address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
  chainId: 250,
  decimals: 6,
};

export const FUSD = {
  name: 'Fantom USD',
  symbol: 'fUSD',
  address: '0xad84341756bf337f5a0164515b1f6f993d194e1f',
  chainId: 250,
  decimals: 18,
};

export const FUSDT = {
  name: 'Frapped USDT',
  symbol: 'fUSDT',
  address: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
  chainId: 250,
  decimals: 6,
};

export const DAI = {
  name: 'Dai Stablecoin',
  symbol: 'DAI',
  address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
  chainId: 250,
  decimals: 18,
};

export const FTM = {
  name: 'Fantom',
  symbol: 'FTM',
  address: '0x0000000000000000000000000000000000000000',
  chainId: 250,
  decimals: 18,
};

export const USDX = {
  name: 'USDX',
  symbol: 'USDX',
  address: '0x0000000000000000000000000000000000000000',
  chainId: 250,
  decimals: 18,
};

export const AVAX = {
  name: 'Avalanche',
  symbol: 'AVAX',
  address: '0x0000000000000000000000000000000000000000',
  chainId: 250,
  decimals: 18,
};

export const TOKEN_EMPTY = {
  name: '',
  symbol: '',
  address: '',
  chainId: 0,
  decimals: 0,
};

export const SPIRIT = {
  name: 'SpiritSwap Token',
  symbol: 'SPIRIT',
  address: '0x5Cc61A78F164885776AA610fb0FE1257df78E59B',
  chainId: 250,
  decimals: 18,
};

export const SPELL = {
  name: 'Spell Token',
  symbol: 'SPELL',
  address: '0x468003B688943977e6130F4F68F23aad939a1040',
  chainId: 250,
  decimals: 18,
};

export const ICE = {
  name: 'IceToken',
  symbol: 'ICE',
  address: '0xf16e81dce15B08F326220742020379B855B87DF9',
  chainId: 250,
  decimals: 18,
};

const CRE8R = {
  name: 'CRE8R DAO',
  symbol: 'CRE8R',
  address: '0x2ad402655243203fcfa7dcb62f8a08cc2ba88ae0',
  chainId: 250,
  decimals: 18,
};

export const wBOMB = {
  name: 'Wrapped BOMB',
  symbol: 'wBOMB',
  address: '0xC09A82aD5075B3067D80F54f05e1E22229699Cc1',
  decimals: 18,
  chainId: 250,
};

export const tokens: Token[] = [
  WCANTO,
  SOULC,
  FTM,
  SPIRIT,
  WFTM,
  wBOMB,
  MIM,
  FRAX,
  USDC,
  FUSD,
  FUSDT,
  DAI,
  CRE8R,
];

// Common tokens lists
export const FIRST_TOKEN_AMOUNT_PANEL = [FTM, USDC, FUSDT, MIM];
export const SECOND_TOKEN_AMOUNT_PANEL = [SPIRIT, FTM, USDC, FUSDT];
export const LIQUIDITY_TOKENS = [SPIRIT, FTM, USDC, FUSDT];

export default tokens;
