import contracts from '../contracts';
import { FarmConfig, QuoteToken } from '../types';

const farmsV2: FarmConfig[] = [
  // {
  //   pid: 1,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'SPIRIT-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x30748322B6E34545DBe0788C421886AEB5297789',
  //   },
  //   gaugeAddress: '0xEFe02cB895b6E061FA227de683C04F3Ce19f3A62',
  //   tokenSymbol: 'SPIRIT',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x5Cc61A78F164885776AA610fb0FE1257df78E59B',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 2,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'WETH-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x613BF4E46b4817015c01c6Bb31C7ae9edAadc26e',
  //   },
  //   gaugeAddress: '0xE86CeE843a5CE2F40575544B1fFc43CB1701D9ae',
  //   tokenSymbol: 'WETH',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 3,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'WBTC-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x279b2c897737a50405ED2091694F225D83F2D3bA',
  //   },
  //   gaugeAddress: '0xDccAFCE93E6e57f0464b4639d4aFD7B9Ad006F61',
  //   tokenSymbol: 'WBTC',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x321162Cd933E2Be498Cd2267a90534A804051b11',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 4,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'gOHM-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xae9BBa22E87866e48ccAcFf0689AFaa41eB94995',
  //   },
  //   gaugeAddress: '0xb3AfA9CB6c53d061bC2263cE15357A691D0D60d4',
  //   tokenSymbol: 'gOHM',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x91fa20244Fb509e8289CA630E5db3E9166233FDc',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 5,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'FRAX-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x7ed0cdDB9BB6c6dfEa6fB63E117c8305479B8D7D',
  //   },
  //   gaugeAddress: '0x805f756d7B2592637725a1b797088c29c9D6A1F8',
  //   tokenSymbol: 'FRAX',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xdc301622e621166BD8E82f2cA0A26c13Ad0BE355',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 6,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'wsHEC-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xE1fd274Ef08D50C3ecdaEe90c322b6c2342AE5DE',
  //   },
  //   gaugeAddress: '0xaAdd9A7155Dbd447c62C1EB574E2FE3967af2E81',
  //   tokenSymbol: 'wsHEC',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x94CcF60f700146BeA8eF7832820800E2dFa92EdA',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 7,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'MIM-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xB32b31DfAfbD53E310390F641C7119b5B9Ea0488',
  //   },
  //   gaugeAddress: '0x0B905475bEa057060D066f3D1F85E6902Ae62557',
  //   tokenSymbol: 'MIM',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x82f0B8B456c1A451378467398982d4834b6829c1',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 8,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'miMATIC-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x51Eb93ECfEFFbB2f6fE6106c4491B5a0B944E8bd',
  //   },
  //   gaugeAddress: '0x27Dc7cc7175F8Ac26dc7421a3a92DAcdc1a9EF0D',
  //   tokenSymbol: 'miMATIC',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xfB98B335551a418cD0737375a2ea0ded62Ea213b',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 9,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'JEWEL-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x782b3e90d85b72fDD3A15dE534fD0DC9D5Ae46E7',
  //   },
  //   gaugeAddress: '0xF399D101fB4D3466f70e2eC25467721eaEC8b460',
  //   tokenSymbol: 'JEWEL',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xD97F9674E2597e7a252de4875985f4385B9608fB',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 10,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'ICE-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x936D23C83c2469f6a14B9f5bEaec13879598A5aC',
  //   },
  //   gaugeAddress: '0xA6A6f26426FB5FE15b33fAe65d1335B02dC54372',
  //   tokenSymbol: 'ICE',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xf16e81dce15B08F326220742020379B855B87DF9',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 11,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'LQDR-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x4Fe6f19031239F105F753D1DF8A0d24857D0cAA2',
  //   },
  //   gaugeAddress: '0x717BDE1AA46a0Fcd937af339f95361331412C74C',
  //   tokenSymbol: 'LQDR',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x10b620b2dbAC4Faa7D7FFD71Da486f5D44cd86f9',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 12,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'USDC-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xe7E90f5a767406efF87Fdad7EB07ef407922EC1D',
  //   },
  //   gaugeAddress: '0xa3C6D55397Dcddaf9f600B082F7a6A918f2F4A5C',
  //   tokenSymbol: 'USDC',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 13,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'fUSDT-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xd14Dd3c56D9bc306322d4cEa0E1C49e9dDf045D4',
  //   },
  //   gaugeAddress: '0xED912897138f8aF455B8F95F75850B11979806D8',
  //   tokenSymbol: 'fUSDT',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 14,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'DAI-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xdbc490b47508D31c9EC44aFB6e132AD01C61A02c',
  //   },
  //   gaugeAddress: '0x1B6cA59BF8A911eE56e58Eb5E5A97F69356EC6C3',
  //   tokenSymbol: 'DAI',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 15,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'SPELL-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x19d4092635740699B6E4735701742740e235165A',
  //   },
  //   gaugeAddress: '0x02ADc9b582E39dc4Cb727a64d8584830CF1bb9bC',
  //   tokenSymbol: 'SPELL',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x468003B688943977e6130F4F68F23aad939a1040',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 16,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'YFI-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x4fc38a2735C7da1d71ccAbf6DeC235a7DA4Ec52C',
  //   },
  //   gaugeAddress: '0x237E7E20bf10a61C8DeD780398AA0D5e69DdfF9c',
  //   tokenSymbol: 'YFI',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x29b0Da86e484E1C0029B56e817912d778aC0EC69',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 17,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'SUSHI-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x9Fe4c0CE5F533e96C2b72d852f190961AD5a7bB3',
  //   },
  //   gaugeAddress: '0x3FD04eEb74204F8FAa5ea539cd5275EC1a3Aa70C',
  //   tokenSymbol: 'SUSHI',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 18,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'LINK-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xd061c6586670792331E14a80f3b3Bb267189C681',
  //   },
  //   gaugeAddress: '0x1360E082C01C897339B82eF098ab4e8B271252C8',
  //   tokenSymbol: 'LINK',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 19,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'CRV-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x374C8ACb146407Ef0AE8F82BaAFcF8f4EC1708CF',
  //   },
  //   gaugeAddress: '0x73eCAaD4Fff43619f31D47D66d841dE41A933488',
  //   tokenSymbol: 'CRV',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x1E4F97b9f9F913c46F1632781732927B9019C68b',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 20,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'MULTI-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x15aFDbDb27767d58A58459ae159814b6bBe6f506',
  //   },
  //   gaugeAddress: '0xfF1E257F9b482567dE88fcE9788502CbD4cC95F2',
  //   tokenSymbol: 'MULTI',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x9Fb9a33956351cf4fa040f65A13b835A3C8764E3',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 21,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'wsSQUID-gOHM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x292e3CF358C40c38156F874ac4Fc726F72543E92',
  //   },
  //   gaugeAddress: '0x0ccb407510C529EfF71F02348E57E26a406Ac0E1',
  //   tokenSymbol: 'wsSQUID',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xb280458B3cf0FAcC33671D52FB0E894447C2539A',
  //   },
  //   quoteTokenSymbol: QuoteToken.GOHM,
  //   quoteTokenAdresses: contracts.gohm,
  // },
  // {
  //   pid: 22,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'JUST-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x0133660D0578Bf9D085033Ea753a27F5Aa2b9de1',
  //   },
  //   gaugeAddress: '0x8A500EB01085776918F90438555d45E35fE863C9',
  //   tokenSymbol: 'JUST',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x37C045bE4641328DFEB625f1Dde610D061613497',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 23,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'FANG-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x871DD566AB3De61E5Cc8fb16fEE82595b17e9cc6',
  //   },
  //   gaugeAddress: '0x3020F2A9d7003923377dE267ac0d6A7F8748e541',
  //   tokenSymbol: 'FANG',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x49894fCC07233957c35462cfC3418Ef0CC26129f',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 24,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'PILLS-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x9C775D3D66167685B2A3F4567B548567D2875350',
  //   },
  //   gaugeAddress: '0x3A514Ce911E86164064F30Bf9134085Ae0E514aC',
  //   tokenSymbol: 'PILLS',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xB66b5D38E183De42F21e92aBcAF3c712dd5d6286',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 25,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'ZOO-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xDF18DD2631f02D930071DF7d6FF89bbc3718C62F',
  //   },
  //   gaugeAddress: '0xd8b503F5Bb44166194B6fB3438918F50341aD63E',
  //   tokenSymbol: 'ZOO',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x09e145A1D53c0045F41aEEf25D8ff982ae74dD56',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 26,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'GRIM-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x2c18c39622b90318B0124eCFd6d4aC81efcC51db',
  //   },
  //   gaugeAddress: '0x6f45A990D727bdBb447078422CfDD8B53c765741',
  //   tokenSymbol: 'GRIM',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x7eC94C4327dC757601B4273cD67014d7760Be97E',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 27,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'TAROT-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xF050133847bb537C7476D054B8bE6e30253Fbd05',
  //   },
  //   gaugeAddress: '0xF7d3dE134c9d09998f94a3de5E0D7F3317Dd97be',
  //   tokenSymbol: 'TAROT',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xC5e2B037D30a390e62180970B3aa4E91868764cD',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 28,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'wMEMO-MIM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xC9B98e4A4e306DFc24bc5b5F66e271e19Fd74c5A',
  //   },
  //   gaugeAddress: '0x86762289Ffb97F8DB441a4fAf5ecd335165e8E08',
  //   tokenSymbol: 'wMEMO',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xDDc0385169797937066bBd8EF409b5B3c0dFEB52',
  //   },
  //   quoteTokenSymbol: QuoteToken.MIM,
  //   quoteTokenAdresses: contracts.mim,
  // },
  // {
  //   pid: 29,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'YOSHI-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x9D2489d0DA3436445a0a5ef8515Dc10B2D8b4eaA',
  //   },
  //   gaugeAddress: '0xc1AE6EdBf55214B3FA690Cc376838785cDb6D8FB',
  //   tokenSymbol: 'YOSHI',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x3dc57B391262e3aAe37a08D91241f9bA9d58b570',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 30,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'DEUS-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x2599eba5fd1e49f294c76d034557948034d6c96e',
  //   },
  //   gaugeAddress: '0x7a91957097e85bb933828d4cC7db287F573D0B2f',
  //   tokenSymbol: 'DEUS',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xDE5ed76E7c05eC5e4572CfC88d1ACEA165109E44',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 31,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'DEI-USDC LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x8efd36aa4afa9f4e157bec759f1744a7febaea0e',
  //   },
  //   gaugeAddress: '0x6cb0CA6635027623684Ebd3387A6F5188fE90ea2',
  //   tokenSymbol: 'DEI',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3',
  //   },
  //   quoteTokenSymbol: QuoteToken.USDC,
  //   quoteTokenAdresses: contracts.usdc,
  // },
  // {
  //   pid: 32,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'PHM-FRAX LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xbd1e1007825602ceC3266d4EF9Ca493b6FFb4D69',
  //   },
  //   gaugeAddress: '0x1b20237B043537B2e56fAbf20E186116703760EC',
  //   tokenSymbol: 'PHM',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xF01Ed6A2b51F97BDeD9bd0Fc841c2D4B5e28BDb2',
  //   },
  //   quoteTokenSymbol: QuoteToken.FRAX,
  //   quoteTokenAdresses: contracts.frax,
  // },
  // {
  //   pid: 33,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'CRE8R-FTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x459e7c947E04d73687e786E4A48815005dFBd49A',
  //   },
  //   gaugeAddress: '0xDcD990038d9CBe98B84a6aD9dBc880e3d4b06599',
  //   tokenSymbol: 'CRE8R',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x2aD402655243203fcfa7dCB62F8A08cc2BA88ae0',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 34,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'GSCARAB-SCARAB LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x8e38543d4c764DBd8f8b98C73407457a3D3b4999',
  //   },
  //   gaugeAddress: '0x9d0f4A1165dDB957a855A6C64e4e4730272f0399',
  //   tokenSymbol: 'GSCARAB',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x6ab5660f0B1f174CFA84e9977c15645e4848F5D6',
  //   },
  //   quoteTokenSymbol: QuoteToken.SCARAB,
  //   quoteTokenAdresses: contracts.scarab,
  // },
  // {
  //   pid: 35,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'gPHM-FRAX LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x0785e2D14954759a73FeaBae4600e2b451A23dDE',
  //   },
  //   gaugeAddress: '0x3079c0AeC6bD47FCbC82E1A3CbA67956D53ca506',
  //   tokenSymbol: 'gPHM',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x354e0Bc93d29bB1E48cF4714E1eDA6DCA4aa8828',
  //   },
  //   quoteTokenSymbol: QuoteToken.FRAX,
  //   quoteTokenAdresses: contracts.frax,
  // },
  // {
  //   pid: 36,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'GRIM EVO-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x1e886FEBc93A5ad833e683d044c6B08D622aF8A7',
  //   },
  //   gaugeAddress: '0x5852f0EA1941a24c281aA7ABa286AfecC0aC7feD',
  //   tokenSymbol: 'GRIMEVO',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x0a77866C01429941BFC7854c0c0675dB1015218b',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 37,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'ATLAS-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xFFcF183126dF14EC4E59409bAb431885ccEEb1C2',
  //   },
  //   gaugeAddress: '0x0680938Dc66DcEb3B1D791172d640e2449Db1D1A',
  //   tokenSymbol: 'ATLAS',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x92df3eaBf7c1c2A6b3D5793f6d53778eA78c48b2',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 38,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'TREEB-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x2cEfF1982591c8B0a73b36D2A6C2A6964Da0E869',
  //   },
  //   gaugeAddress: '0x27829EAaB2972fD49eE753abFc67cC3EaC9c7397',
  //   tokenSymbol: 'TREEB',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xc60D7067dfBc6f2caf30523a064f416A5Af52963',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 39,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'AVAX-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x058F7F3Eece0Ad064DE27c1d7188E1baB4E5AA1c',
  //   },
  //   gaugeAddress: '0x70dFcc39aB4e7718Fff8bC7012bf3b2AB96b9876',
  //   tokenSymbol: 'AVAX',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x511D35c52a3C244E7b8bd92c0C297755FbD89212',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 40,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'MATIC-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x1a5CB3948dAf3130f37cbD4C2EBD36b7B315Bb5b',
  //   },
  //   gaugeAddress: '0x12229A41f878952F6e41feb922BF92986C470a5f',
  //   tokenSymbol: 'MATIC',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x40DF1Ae6074C35047BFF66675488Aa2f9f6384F3',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 41,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'BOMB-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x11d7fD8Deb7F37EA97218F70550E03fe6683df3D',
  //   },
  //   gaugeAddress: '0x567A35E2CC409753a4e261CF4073D297aDb800D9',
  //   tokenSymbol: 'BOMB',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x8503eb4A136bDBeB323E37Aa6e0FA0C772228378',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 42,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'BIFI-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xc28cf9aeBfe1A07A27B3A4d722C841310e504Fe3',
  //   },
  //   gaugeAddress: '0x356169Bea8c58C3B59e83C650A1608FC54D0c44A',
  //   tokenSymbol: 'BIFI',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xd6070ae98b8069de6B494332d1A1a81B6179D960',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 43,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'MIDAS-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xede32b76302CB71cc0467C4B42DAbFfa6b091Dd1',
  //   },
  //   gaugeAddress: '0x6d717dDdF5d97AC7cC7e3ea6524cA61233A9460D',
  //   tokenSymbol: 'MIDAS',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xb37528DA6b4D378305d000a66Ad91bd88E626761',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 44,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'RING-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x33B25FA6EbA0FCf6c7CEF56Fef41Be21B87a2162',
  //   },
  //   gaugeAddress: '0x1741b224344e4c12a44EBABF80e5fb9D2E07A363',
  //   tokenSymbol: 'RING',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x582423C10c9e83387a96d00A69bA3D11ee47B7b5',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 45,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'GRO-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xF5F20491aF9e7C5D94714faF160EC81387F50579',
  //   },
  //   gaugeAddress: '0xf022a9f642373d793a97cA58e08aF7D82459F38A',
  //   tokenSymbol: 'GRO',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x91f1430833879272643658f8ed07d60257ddf321',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 46,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'ALPACA-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x7a412A09eaBa0CbE20345d8611d937Fb74CFE535',
  //   },
  //   gaugeAddress: '0x8523165332daD24A9C0234B46Afd660A5f530E7D',
  //   tokenSymbol: 'ALPACA',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xaD996A45fd2373ed0B10Efa4A8eCB9de445A4302',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 47,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'HND-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x03dE4A4897941712BeBE5362729181257dC9E8B6',
  //   },
  //   gaugeAddress: '0xA04887B5C773B76D5c5825D909Fdfbd99e5Ed42e',
  //   tokenSymbol: 'HND',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x10010078a54396F62c96dF8532dc2B4847d47ED3',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 48,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'beFTM-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xE3D4C22d0543E050a8b3F713899854Ed792fc1bD',
  //   },
  //   gaugeAddress: '0xaB9F86eFd519eb9B110542FAF984780e3D99E697',
  //   tokenSymbol: 'beFTM',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x7381eD41F6dE418DdE5e84B55590422a57917886',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 49,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'OATH-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xD0891213C87D68773477428aC800B5F7eECF641e',
  //   },
  //   gaugeAddress: '0xfF7956858Ed2A9bC40DAB69CB30521B7576e9136',
  //   tokenSymbol: 'OATH',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x21Ada0D2aC28C3A5Fa3cD2eE30882dA8812279B6',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 50,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'COMB-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x95297492B1fAA6047D1D8CE982A0F5cDEB0e9482',
  //   },
  //   gaugeAddress: '0xD07395045F1ee27F1662548a5c6185b1E3Cd1dd5',
  //   tokenSymbol: 'COMB',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xaE45a827625116d6C0C40B5D7359EcF68F8e9AFD',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 51,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'PGUNK-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x98f70fc717ADcAdE6B0A24df54c49EAbDc5EFC46',
  //   },
  //   gaugeAddress: '0x59266B46d0f4821804b66Aa34B39b6B645Ef0B2a',
  //   tokenSymbol: 'PGUNK',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xf8Fc059dAfDCe4EF2EdFc72cbBAF410d7531E610',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 52,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'UNIDX-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x38655f2e859960f3Cc10848777982faBA3451Ec7',
  //   },
  //   gaugeAddress: '0x7a00Dd84829299A9dec10Ac7732fCFccD9273063',
  //   tokenSymbol: 'UNIDX',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x2130d2a1e51112D349cCF78D2a1EE65843ba36e0',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 53,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'UST-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0xFA84CED3DC4bFFAF93d21B9E3A4750F5C2A42886',
  //   },
  //   gaugeAddress: '0xb1bC9455Db839655b1a3c1c128E6aB094190b724',
  //   tokenSymbol: 'UST',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x846e4D51d7E2043C1a87E0Ab7490B93FB940357b',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 54,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'ORKAN-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x5A6880d3e9d715BEf5848c9749cea5F23a982A75',
  //   },
  //   gaugeAddress: '0xca05DC1Ab089173F8DeDD89f39dC48ddE36479d5',
  //   tokenSymbol: 'ORKAN',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xfB66e49e303A186a4c57414Ceeed651a7a78161a',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 55,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'ORBS-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x1F0700387Dfe4Aec7b8C99fbf54cdCDbBB5603B5',
  //   },
  //   gaugeAddress: '0xd0F5846B411Bd71012b27b061aeD04602D062897',
  //   tokenSymbol: 'ORBS',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x3E01B7E242D5AF8064cB9A8F9468aC0f8683617c',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 56,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'sFTMx-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x72133BBff5072616E165237e69b3F4c87C1a94e8',
  //   },
  //   gaugeAddress: '0x3A3C0449FDd642Dd9Bb714B5B8F90D7f198A0024',
  //   tokenSymbol: 'sFTMX',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0xd7028092c830b5C8FcE061Af2E593413EbbC1fc1',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
  // {
  //   pid: 57,
  //   isPsc: true,
  //   isGauge: true,
  //   lpSymbol: 'gALCX-WFTM LP',
  //   lpAddresses: {
  //     4002: '',
  //     250: '0x633EFedFC7F1742A7e70f5Bcb9FA22B15204e56B',
  //   },
  //   gaugeAddress: '0xDc2C4dC72dBB3870C537037AA794fddda18ac190',
  //   tokenSymbol: 'gALCX',
  //   tokenAddresses: {
  //     4002: '',
  //     250: '0x70F9fd19f857411b089977E7916c05A0fc477Ac9',
  //   },
  //   quoteTokenSymbol: QuoteToken.FTM,
  //   quoteTokenAdresses: contracts.wftm,
  // },
];

export default farmsV2;
