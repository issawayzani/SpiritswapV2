import {
  HStack,
  Icon,
  Grid,
  Stack,
  Text,
  GridItem,
  Box,
  Flex,
  useMediaQuery,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { TopCard } from './components/TopCard';

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'app/hooks/Routing';
import Heading from './components/Heading';
import { Test } from 'utils/web3';
import Settings from './components/Settings';
import SpiritsBackground from './components/Background';
import {
  SwapPanel,
  StakePanel,
  BorrowPanel,
  OptionsPanel,
} from './components/Panels';
import { RouteContainer, SwapContainer } from './styles';
import TabSelect from 'app/components/TabSelect';
import { useTranslation } from 'react-i18next';
import { ArrowRightIcon1 } from 'app/assets/icons';
import { Token } from 'app/interfaces/General';
import { SwapState } from './Swap.d';
import tokens, { FTM } from 'constants/tokens';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { SwapProps } from './Swap.d';
import { Chart } from './components/Chart';
import { breakpoints } from 'theme/base/breakpoints';
import SwapConfirm from './components/Confirm';
import { QuoteParams, SwapQuote } from 'utils/swap';
import UseIsLoading from 'app/hooks/UseIsLoading';
import useMobile from 'utils/isMobile';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import {
  FTM_TOKEN_NULL_ADDRESS,
  LIMIT_PAY,
  LIMIT_PRICE,
  LIMIT_RECIEVE,
  WFTM,
} from 'constants/index';
import { checkInvalidValue, getChartUrl, getLpAddress } from 'app/utils';
import ImageLogo from 'app/components/ImageLogo';
import useGetLpFromApollo from 'app/hooks/useGetLpFromApollo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectBottomCardIndex,
  selectSwapModeIndex,
  selectUserCustomTokens,
  selectBondingCurveInfo,
} from 'store/general/selectors';
import {
  setGlobalSwapModeIndex,
  setGlobalBottomCardIndex,
  setBondingCurveInfo,
} from 'store/general';
import useQuoteRate from 'app/hooks/useQuoteRate';
import useGetGasPrice from 'app/hooks/useGetGasPrice';
import useWallets from 'app/hooks/useWallets';
import useSettings from 'app/hooks/useSettings';
import { useTokenBalance } from 'app/hooks/useTokenBalance';
import TWAPPanel from 'app/components/TWAP/TWAPPanel';
import { SOULC } from 'app/router/routes';
import TopRightCard from './components/TopCard/TopRightCard';
import { StablePanel } from '../Liquidity/components/Panels';
import { ConnectWallet } from 'app/components/ConnectWallet';

const SwapPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { account, isLoggedIn } = useWallets();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const globalSwapModeIndex = useAppSelector(selectSwapModeIndex);
  const globalBottomCardIndex = useAppSelector(selectBottomCardIndex);
  const translationPath = 'swap.questionHelper';
  const [modeIndex, setModeIndex] = useState<number>(globalSwapModeIndex || 0);
  const [cardIndex, setCardIndex] = useState<number>(
    globalBottomCardIndex || 0,
  );
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const { handlers, states } = useSettings();
  const [swapConfirm, setSwapConfirm] = useState<boolean>(false);
  const [isLimit, setIsLimit] = useState<boolean>(false);
  const [trade, setTrade] = useState<SwapQuote | undefined>(undefined);
  const [routes, setRoutes] = useState<Token[]>([]);
  const [chartUrl, setChartUrl] = useState<string>('');
  const [chartCurrency, setChartCurrency] = useState<string>('stable');
  const [makeCallToTheGraph, setMakeCallToTheGraph] = useState<boolean>(false);
  const { loadingOff, loadingOn, isLoading } = UseIsLoading();
  const isMobile = useMobile();
  const { token1, token2 } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { gasPrice, txGweiCost } = useGetGasPrice({ speed: states.txSpeed });
  const userCustomTokens = useAppSelector(selectUserCustomTokens);
  const BondingCurveData = useAppSelector(selectBondingCurveInfo);
  const allTokens = [...tokens, ...(userCustomTokens || [])];
  const [showChart, setShowChart] = useState<boolean>(
    states.showChart ?? false,
  );

  useEffect(() => {
    const stateFromUrl = state as { limitOrderPanel: boolean };
    if (stateFromUrl && stateFromUrl.limitOrderPanel) {
      setModeIndex(1);
    }
  }, [state]);

  const setToken = (inputToken: Token, outputToken: Token) => {
    try {
      if (inputToken.symbol === outputToken.symbol) {
        navigate(`${SOULC.path}/FTM/SPIRIT`, { replace: true });
        return [allTokens[0], allTokens[1]];
      }
      return [inputToken, outputToken];
    } catch (error) {
      return [allTokens[0], allTokens[1]];
    }
  };
  const connect = () => {
    onOpen();
  };
  const matchesToken = (token, param) => {
    if (!param) {
      return false;
    }
    return [
      `${token.symbol}`.toLowerCase(),
      `${token.address}`.toLowerCase(),
    ].includes(param.toLowerCase());
  };

  const [queriedTokenOne] = allTokens.filter(token =>
    matchesToken(token, token1),
  );

  const [queriedTokenTwo] = allTokens.filter(token =>
    matchesToken(token, token2),
  );
  const [inputValue, outputValue] = setToken(queriedTokenOne, queriedTokenTwo);
  const initialState = {
    value: '',
    limitsell: '',
    limitbuy: '',
    tokenSelected: inputValue,
  };

  const initialState1 = {
    value: '',
    limitsell: '',
    limitbuy: '',
    tokenSelected: outputValue,
  };
  const [firstToken, setFirstToken] = useState<SwapState>(initialState);
  const [secondToken, setSecondToken] = useState<SwapState>(initialState1);
  const [showInputInUSD, setShowInputInUSD] = useState<boolean>(false);

  const isWrapped = () => {
    const { symbol: ipSymbol } = firstToken.tokenSelected;
    const { symbol: opSymbol } = secondToken.tokenSelected;
    if (ipSymbol === 'FTM' && opSymbol === 'WFTM') return true;
    if (ipSymbol === 'WFTM' && opSymbol === 'FTM') return true;
    return false;
  };
  const [quoteRateParams, setQuoteRateParams] = useState<QuoteParams>({
    buyToken: '0',
    sellToken: '0',
    buyAmount: '0',
    sellAmount: '0',
    slippagePercentage: 0,
    includedSources: '0',
    gasPrice: '0',
  });

  const [changeRateData, setChangeRateData] = useState({
    value: '0',
    type: 0,
    txType: '',
    tokenFrom: firstToken,
    tokenTo: secondToken,
    keepSecondAmount: false,
    changedTokenFrom: 0,
  });

  const { token: tokenA } = useTokenBalance(
    firstToken.tokenSelected.chainId,
    firstToken.tokenSelected.address,
    'token',
    firstToken.tokenSelected,
  );

  const { token: tokenB } = useTokenBalance(
    secondToken.tokenSelected.chainId,
    secondToken.tokenSelected.address,
    'token',
    secondToken.tokenSelected,
  );

  const { quoteRateEstimation: tx, txError } = useQuoteRate(quoteRateParams);

  const lpAddressFromTheGraph = useGetLpFromApollo(
    firstToken.tokenSelected.address,
    secondToken.tokenSelected.address,
    makeCallToTheGraph,
  );

  useEffect(() => {
    if (queriedTokenOne && !queriedTokenTwo) {
      return navigate(
        `${SOULC.path}/${queriedTokenOne.symbol}/${
          queriedTokenOne.symbol === 'SPIRIT' ? 'FTM' : 'SPIRIT'
        }`,
        { replace: true },
      );
    }
    if (!queriedTokenOne) {
      return navigate(`${SOULC.path}/FTM/SPIRIT`, { replace: true });
    }
  }, [queriedTokenOne, queriedTokenTwo, navigate]);

  useEffect(() => {
    if (firstToken.value === '0' || firstToken.value === '') {
      setSecondToken({ ...secondToken, value: '' });
      loadingOff();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstToken]);

  useEffect(() => {
    let LPAddressFromConstants = getLpAddress(
      firstToken.tokenSelected.address,
      secondToken.tokenSelected.address,
    );

    if (!LPAddressFromConstants) {
      setMakeCallToTheGraph(true);
      LPAddressFromConstants = getLpAddress(
        WFTM.address,
        secondToken.tokenSelected.address,
      );
    }

    const url = getChartUrl({
      pairAddress: !LPAddressFromConstants
        ? lpAddressFromTheGraph.lpAddress
        : LPAddressFromConstants,
      inTokenAddress: firstToken.tokenSelected.address,
      outTokenAddress: secondToken.tokenSelected.address,
      currency: chartCurrency,
    });
    setChartUrl(url);
    setMakeCallToTheGraph(false);
  }, [
    firstToken.tokenSelected.address,
    secondToken.tokenSelected.address,
    lpAddressFromTheGraph,
    chartCurrency,
  ]);

  // useEffect(() => {
  //   const fetch = async () => {
  //     const data = await Test(account, null, null);
  //     dispatch(setBondingCurveInfo(data?.result));
  //   };
  //   fetch();
  // },[account]) ;
  useEffect(() => {
    const fetch = async () => {
      const data = await Test(account, null, null);
      dispatch(setBondingCurveInfo(data?.result));
    };
    if (account) {
      fetch();
    }
    setIsLimit(modeIndex !== 0);
    dispatch(setGlobalSwapModeIndex(modeIndex));
    dispatch(setGlobalBottomCardIndex(cardIndex));
    if (!isLoggedIn) {
      setShowSettings(false);
      setSwapConfirm(false);
      setTrade(undefined);
      setRoutes([]);
      setChartUrl('');
      setMakeCallToTheGraph(false);
    }
  }, [
    modeIndex,
    cardIndex,
    globalBottomCardIndex,
    globalSwapModeIndex,
    dispatch,
    isLoggedIn,
    account,
  ]);

  const changeRateParams = (
    value,
    type,
    txType,
    tokenFrom = firstToken,
    tokenTo = secondToken,
    keepSecondAmount = false,
    changedTokenFrom = LIMIT_PAY,
  ) => {
    loadingOn();
    const tokenADecimals = tokenFrom.tokenSelected.decimals;
    const tokenBDecimals = tokenTo.tokenSelected.decimals;
    const tokenASymbol = tokenFrom.tokenSelected.symbol;
    const tokenBSymbol = tokenTo.tokenSelected.symbol;

    let txValue: string = value === '' || value === 'Infinity' ? '0' : value;

    // set data to estimations
    setChangeRateData({
      value: txValue,
      type,
      txType,
      tokenFrom,
      tokenTo,
      keepSecondAmount,
      changedTokenFrom,
    });

    if (txType !== 'swap') {
      // asignTokenValues(txType, changedTokenFrom, tokenFrom, tokenTo, txValue);
    } else if (txValue === '0') {
      setFirstToken({ ...tokenFrom, value: '' });
      setSecondToken({ ...tokenTo, value: '' });
      setTrade(undefined);
      return;
    }

    let params: QuoteParams = {
      sellToken:
        tokenASymbol === 'FTM'
          ? FTM_TOKEN_NULL_ADDRESS.address
          : tokenFrom.tokenSelected.address,
      buyToken:
        tokenBSymbol === 'FTM'
          ? FTM_TOKEN_NULL_ADDRESS.address
          : tokenTo.tokenSelected.address,
      slippagePercentage: Number(states.slippage),
    };
    if (!type) {
      if (txType === 'swap') {
        setFirstToken({ ...tokenFrom, value: txValue });
      }

      if (
        firstToken.tokenSelected &&
        tokenADecimals !== firstToken.tokenSelected.decimals
      ) {
        txValue = '1';
      }

      if (
        txType === 'limitbuy' ||
        txType === 'limitsell' ||
        txType === 'limit'
      ) {
        params.sellAmount = parseUnits(txValue, tokenADecimals).toString();
      } else {
        params.sellAmount = parseUnits(
          showInputInUSD
            ? (+txValue / tokenA.rate).toFixed(txValue.length) || '0'
            : txValue,
          tokenADecimals,
        ).toString();
      }
    } else {
      // write second input
      if (txType === 'swap') {
        params.buyAmount = parseUnits(
          showInputInUSD
            ? (+txValue / tokenB.rate).toFixed(txValue.length) || '0'
            : txValue,
          tokenBDecimals,
        ).toString();
        setSecondToken({ ...tokenTo, value: txValue });
      }
    }

    if (keepSecondAmount) {
      params.sellAmount = tokenFrom.value
        ? parseUnits(tokenFrom.value, tokenADecimals).toString()
        : '0';
      delete params.buyAmount;
    }

    params.gasPrice = `${gasPrice}`;

    setQuoteRateParams(params);
  };

  useEffect(() => {
    setEstimations(changeRateData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx, changeRateData]);

  const setEstimations = ({
    type,
    txType,
    tokenFrom,
    tokenTo,
    keepSecondAmount,
  }) => {
    const token1Decimals = tokenFrom.tokenSelected.decimals;
    const token2Decimals = tokenTo.tokenSelected.decimals;
    if (!firstToken.value && !secondToken.value) return;
    setTrade(tx);
    if (isWrapped()) {
      loadingOff();
      if (!type) {
        setSecondToken({
          ...tokenTo,
          value: firstToken.value,
        });
      } else {
        setFirstToken({
          ...tokenFrom,
          value: secondToken.value,
        });
      }
    } else if (tx && tx.buyTokenAddress && tx.orders.length) {
      loadingOff();
      if (txType === 'receive') {
        tx.price = (1 / parseFloat(tx.price)).toString();
      }

      if (txType === 'swap') {
        // We set the value for the other input form
        if (!type) {
          setSecondToken({
            ...tokenTo,
            value: showInputInUSD
              ? `${tx.priceRoute?.destUSD}`
              : formatUnits(tx.buyAmount, token2Decimals),
          });
        } else if (`${txType}` === 'receive' && type) {
          setSecondToken({
            ...tokenTo,
            value: showInputInUSD
              ? `${tx.priceRoute?.destUSD}`
              : formatUnits(tx.buyAmount, token2Decimals),
          });
        } else {
          setFirstToken({
            ...tokenFrom,
            value: showInputInUSD
              ? `${tx.priceRoute?.srcUSD}`
              : formatUnits(tx.sellAmount, token1Decimals),
          });
        }

        if (keepSecondAmount) {
          setSecondToken({
            ...tokenTo,
            value: showInputInUSD
              ? `${tx.priceRoute?.destUSD}`
              : formatUnits(tx.buyAmount, token2Decimals),
          });
        }
      }

      // Set routes for the transaction
      const routeAddresses: string[] = [];
      tx.orders.forEach(order => {
        order.fillData.tokenAddressPath.map(address =>
          routeAddresses.push(address.toLocaleLowerCase()),
        );
      });

      const routeData: Token[] = [];

      routeAddresses.forEach(rAddress => {
        const [token] = allTokens.filter(
          token => token.address.toLowerCase() === rAddress.toLowerCase(),
        );
        if (token) {
          routeData.push(token);
        }
      });

      setRoutes(routeData);
    }
  };

  const handleChangeInput = (
    value,
    type: number,
    txType: string = 'swap',
    tokenFrom = firstToken,
    tokenTo = secondToken,
    keepSecondAmount = false,
    changedTokenFrom = LIMIT_PAY,
  ) => {
    changeRateParams(
      value,
      type,
      txType,
      tokenFrom,
      tokenTo,
      keepSecondAmount,
      changedTokenFrom,
    );
  };

  const handleChangeToken = (
    tokenSelected: Token,
    onClose: () => void,
    type: number,
    txType: string = 'swap',
  ) => {
    const defaultOtherToken = tokenSelected.symbol === 'FTM' ? 'SPIRIT' : 'FTM';
    if (!type) {
      const newToken = { ...firstToken, tokenSelected };

      const firstIsSameAsSecond =
        tokenSelected.symbol === secondToken.tokenSelected.symbol;

      if (newToken.tokenSelected.symbol === secondToken.tokenSelected.symbol) {
        swapAmountPanel();
      } else {
        changeRateParams(firstToken.value, type, txType, newToken, secondToken);
      }
      navigate(
        `${SOULC.path}/${newToken.tokenSelected.symbol}/${
          firstIsSameAsSecond
            ? defaultOtherToken
            : secondToken.tokenSelected.symbol
        }`,
        { replace: true },
      );
    } else {
      const newToken = { ...secondToken, tokenSelected };

      const secondIsSameAsFirst =
        tokenSelected.symbol === firstToken.tokenSelected.symbol;

      if (newToken.tokenSelected.symbol === firstToken.tokenSelected.symbol) {
        swapAmountPanel();
      } else {
        changeRateParams(
          secondToken.value,
          type,
          txType,
          firstToken,
          newToken,
          true,
        );
      }

      navigate(
        `${SOULC.path}/${
          secondIsSameAsFirst
            ? defaultOtherToken
            : firstToken.tokenSelected.symbol
        }/${newToken.tokenSelected.symbol}`,
        { replace: true },
      );
    }
    onClose();
    loadingOff();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // const toggleChart = () => {
  //   setShowChart(!showChart);
  //   handlers.handleShowChart(!showChart);
  // };

  const getHelperContentSwap = (mode: number) => {
    if (mode === 0) {
      return {
        title: t(`${translationPath}.swap`) || '',
        text: t(`${translationPath}.swapExplanation`),
      };
    }
    if (mode === 1) {
      return {
        title: t(`${translationPath}.limitBuy`),
        text: t(`${translationPath}.limitBuyExplanation`),
      };
    }
    if (mode === 2) {
      return {
        title: t(`${translationPath}.limitSell`),
        text: t(`${translationPath}.limitSellExplanation`),
      };
    }
    if (mode === 3) {
      return {
        title: t(`${translationPath}.twap`),
        text: t(`${translationPath}.twapExplanation`),
      };
    }
  };

  const helperContent = getHelperContentSwap(modeIndex);

  const swapAmountPanel = () => {
    const token1 = firstToken;
    const token2 = secondToken;
    setFirstToken(token2);
    setSecondToken(token1);
    navigate(
      `${SOULC.path}/${token2.tokenSelected.symbol}/${token1.tokenSelected.symbol}`,
      { replace: true },
    );
    changeRateParams(firstToken.value, 0, 'swap', token2, token1);
  };

  const panelProps: SwapProps = {
    firstToken,
    secondToken,
    trade,
    slippage: states.slippage,
    isLoading,
    isLimit,
    handleChangeToken,
    handleChangeInput,
    showInputInUSD,
    setShowInputInUSD,
    setSwapConfirm,
    swapAmountPanel,
    toggleSettings,
    modeIndex,
    approveMax: states.approveMax,
    apiCallError: txError,
  };

  const panels = [
    {
      key: 0,
      children: (
        <SwapPanel
          panelProps={panelProps}
          deadline={states.deadline}
          bondingCurveData={BondingCurveData}
          isWrapped={isWrapped()}
        />
      ),
    },
    {
      key: 1,
      children: (
        <StakePanel account={account} bondingCurveData={BondingCurveData} />
      ),
    },
    {
      key: 2,
      children: (
        <BorrowPanel account={account} bondingCurveData={BondingCurveData} />
      ),
    },
    {
      key: 3,
      children: (
        <OptionsPanel account={account} bondingCurveData={BondingCurveData} />
      ),
    },
  ];

  const [isLessThan1100px] = useMediaQuery('(max-width: 1100px)');

  const columns = () => {
    const columns = { base: '95%' };

    if (isLimit) {
      if (isLessThan1100px) columns['md'] = '520px';
      else columns['md'] = '520px 1fr';
      return columns;
    }

    columns['md'] = '700px 1fr';
    return columns;
  };

  return (
    <Box overflowX="hidden">
      <HelmetProvider>
        <Helmet>
          <title>Coveragex - Swap</title>
          <meta name="Coveragex" content="Swap page" />
        </Helmet>
      </HelmetProvider>

      <Box>
        <Grid
          display={{ base: 'grid', lg: 'grid' }}
          top={isMobile ? '124px' : '170px'}
          position="relative"
          templateRows="1fr"
          templateColumns={columns()}
          m="0 auto"
          mb="250px"
          minH="75vh"
          placeContent="center"
          maxW={{ md: breakpoints.xl }}
        >
          <GridItem rowSpan={1} colSpan={2}>
            <div className="container">
              <TopCard
                icon="fa-users"
                TVL={BondingCurveData?.tvl / 1e18}
                supplyVTOKEN={BondingCurveData?.supplyVTOKEN}
                APR={BondingCurveData?.apr / 1e18}
                supplyTOKEN={BondingCurveData?.supplyTOKEN / 1e18}
                LTV={BondingCurveData?.ltv / 1e18}
                Ratio={BondingCurveData?.ratio / 1e18}
              />
            </div>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <Box>
              {/* <SpiritsBackground
                islimit={isLimit}
                showChart={showChart}
                showSettings={showSettings}
              /> */}

              <SwapContainer islimit={`${isLimit}`}>
                {isLoggedIn ? (
                  <>
                    {showSettings ? (
                      <Settings
                        toggleSettings={toggleSettings}
                        txGweiCost={txGweiCost}
                        states={{
                          showChart: states.showChart,
                          slippage: states.slippage,
                          speedIndex: states.speedIndex,
                          deadline: states.deadline,
                          approveMax: states.approveMax,
                        }}
                        handlers={{
                          handleSlippage: handlers.handleSlippage,
                          handleShowChart: handlers.handleShowChart,
                          handleTxSpeed: handlers.handleTxSpeed,
                          handleDeadline: handlers.handleDeadline,
                          handleApproveMax: handlers.handleApproveMax,
                          handleSpeedIndex: handlers.handleSpeedIndex,
                          handleResetAll: handlers.handleResetAll,
                        }}
                      />
                    ) : (
                      <Stack>
                        <Heading
                          toggleSettings={toggleSettings}
                          // toggleChart={toggleChart}
                          helperModal={helperContent}
                        />
                        <TabSelect
                          index={modeIndex}
                          setIndex={setModeIndex}
                          styleIndex={[2]}
                          styleVariant="danger"
                          names={['Swap', 'Stake', 'Borrow', 'Options']}
                          panels={panels}
                        />
                      </Stack>
                    )}
                  </>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Button onClick={connect}>Connect Wallet</Button>
                  </div>
                  // <SwapConfirm
                  //   firstToken={firstToken}
                  //   secondToken={secondToken}
                  //   setSwapConfirm={setSwapConfirm}
                  //   isLimit={isLimit}
                  //   trade={trade}
                  //   showInputInUSD={showInputInUSD}
                  //   isWrapped={isWrapped()}
                  //   resetInput={() => {
                  //     setFirstToken({
                  //       ...firstToken,
                  //       value: '',
                  //     });
                  //     setSecondToken({
                  //       ...secondToken,
                  //       value: '',
                  //     });
                  //   }}
                  // />
                )}
              </SwapContainer>
            </Box>
          </GridItem>

          <GridItem rowSpan={1} colSpan={1}>
            <Box ml="10px">
              <TopRightCard
                account={account}
                bondingCurveData={BondingCurveData}
              />
            </Box>
          </GridItem>
        </Grid>
      </Box>
      <ConnectWallet isOpen={isOpen} dismiss={onClose} />
    </Box>
  );
};

export default SwapPage;
