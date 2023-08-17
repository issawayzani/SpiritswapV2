import { useState, useEffect } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Center,
  Flex,
  SimpleGrid,
  Skeleton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import NewTokenAmountPanel from 'app/components/NewTokenAmountPanel/NewTokenAmountPanel';
import { useTranslation } from 'react-i18next';
import { SwapProps } from '../../Swap.d';
import { Token } from 'app/interfaces/General';
import { approve, transactionResponse } from 'utils/web3';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { NON_ZERO, NOT_ENOUGH_FUNDS } from 'constants/errors';
import { GetBalanceByToken } from 'app/utils/methods';
import { SlippageIcon, SwapIconButton } from 'app/assets/icons';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { ConnectWallet } from 'app/components/ConnectWallet';
import { useCheckAllowance } from 'app/hooks/useCheckAllowance';
import useWallets from 'app/hooks/useWallets';
import { openInNewTab } from 'app/utils/redirectTab';
import { setGlobalOptionsIndex, setGlobalSwapIndex } from 'store/general';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { WrapPanel, UnWrapPanel } from '.';
import { selectSwapIndex } from 'store/general/selectors';
import TabSelect from 'app/components/TabSelect';
import SettingSwap from 'app/assets/images/setting-new.svg';

export default function SwapPanel({
  panelProps,
  isWrapped,
  bondingCurveData,
  deadline,
}) {
  const dispatch = useAppDispatch();
  const [quoteSlippage, setQuoteSlippage] = useState(0);
  const globalSwapIndex = useAppSelector(selectSwapIndex);
  const [swapIndex, setSwapIndex] = useState<number>(globalSwapIndex || 0);
  const { isLoggedIn, account } = useWallets();
  const {
    trade,
    handleChangeInput,
    handleChangeToken,
    firstToken,
    secondToken,
    slippage,
    isLoading,
    swapAmountPanel,
    setSwapConfirm,
    showInputInUSD,
    setShowInputInUSD,
    toggleSettings,
    approveMax,
    apiCallError,
  }: SwapProps = panelProps;
  const swapPanels = [
    {
      key: 0,
      children: (
        <WrapPanel
          deadline={deadline}
          setQuoteSlippage={setQuoteSlippage}
          slippage={slippage}
          account={account}
          bondingCurveData={bondingCurveData}
        />
      ),
    },
    {
      key: 1,
      children: (
        <UnWrapPanel
          deadline={deadline}
          setQuoteSlippage={setQuoteSlippage}
          slippage={slippage}
          account={account}
          bondingCurveData={bondingCurveData}
        />
      ),
    },
  ];
  const tabNames = [
    {
      key: 0,
      name: 'Wrap',
      className: 'panel-button-left',
    },
    {
      key: 1,
      name: 'Unwrap',
      className: 'panel-button-right',
    },
  ];
  useEffect(() => {
    dispatch(setGlobalSwapIndex(swapIndex));
  }, [swapIndex, globalSwapIndex]);

  const { t } = useTranslation();
  const translationsPath = 'swap.panels.swap';
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const settingsTranslationPath = 'swap.settings';
  const { addToQueue } = Web3Monitoring();

  const { isLoading: txLoading, loadingOff, loadingOn } = UseIsLoading();
  const [loaderText, setLoaderText] = useState('Loading');
  const [loadAmountInput1, setLoadAmountInput1] = useState(false);
  const [loadAmountInput2, setLoadAmountInput2] = useState(false);
  const [isBalanceSufficient, setIsBalanceSufficient] = useState(true);
  const [errorMessage, setErrorMessage] = useState<{
    msg: string | null;
    relevantTokens: string[] | null;
  }>({
    msg: '',
    relevantTokens: [],
  });
  const [balanceData, setBalanceData] = useState({
    hasBalance: false,
    symbol: '',
    isOutput: false,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [approved, setApproved, approvalDiff] = useCheckAllowance(
    firstToken,
    secondToken,
    account,
    trade?.allowanceTarget,
  );

  const firstTokenBalance = GetBalanceByToken(firstToken.tokenSelected).balance;

  const approveToken = async () => {
    try {
      if (firstToken && trade) {
        setIsApproving(true);
        const tx = await approve(
          firstToken.tokenSelected.address,
          trade.allowanceTarget,
          !approveMax ? approvalDiff : undefined,
        );

        const response = transactionResponse('swap.approve', {
          operation: 'APPROVE',
          tx: tx,
          uniqueMessage: {
            text: 'Approving',
            secondText: firstToken.tokenSelected.symbol,
          },
        });

        addToQueue(response);
        await tx.wait();
        loadingOff();
        setApproved(true);
        setIsApproving(false);
        return true;
      }
    } catch (error) {
      loadingOff();
      setIsApproving(false);
      setLoaderText('Loading');
      return false;
    }
  };

  const hasErrors = () => {
    const checkNonZeroValue = !+firstToken.value;
    if (checkNonZeroValue)
      setErrorMessage({ msg: NON_ZERO, relevantTokens: [] });
    if (!isBalanceSufficient)
      setErrorMessage({ msg: NOT_ENOUGH_FUNDS, relevantTokens: [] });
    return checkNonZeroValue || !isBalanceSufficient;
  };

  const buttonAction = async () => {
    if (!isLoggedIn) {
      onOpen();
      return;
    }

    if (!hasErrors()) {
      let approveSuccess: boolean | undefined = true;
      if (!approved) {
        loadingOn();
        setLoaderText('Pending Approval');
        approveSuccess = await approveToken();
      }

      if (approveSuccess) {
        loadingOn();
        setLoaderText('Pending Transaction');
        return setSwapConfirm(true);
      }
    }
  };

  const onChangeNumberInput = (value, type: number) => {
    if (type === 0) {
      setLoadAmountInput2(true);
      setLoadAmountInput1(false);
    } else if (type === 1) {
      setLoadAmountInput1(true);
      setLoadAmountInput2(false);
    }
    handleChangeInput(value, type);
  };

  const swapLegend = () => {
    const { symbol: inputSymbol } = firstToken.tokenSelected;
    const { symbol: outputSymbol } = secondToken.tokenSelected;
    if (!trade) return 'Swap Token';
    if (inputSymbol === 'FTM' && outputSymbol === 'WFTM') return 'Wrap';
    if (inputSymbol === 'WFTM' && outputSymbol === 'FTM') return 'Unwrap';
    if (!approved) return 'Approve Swap';
    return 'Swap Token';
  };

  const getDisabledStatus = (): boolean => {
    const DISABLED = true;
    const NOT_DISABLED = false;
    if (approved || isApproving) {
      if (errorMessage.msg) return DISABLED;
      if (Boolean(apiCallError)) return DISABLED;
      if (!isWrapped && !trade) return DISABLED;
      if (!firstToken.value) return DISABLED;
      if (isApproving) return DISABLED;
    }
    if (!trade) return DISABLED;
    return NOT_DISABLED;
  };

  useEffect(() => {
    const { isOutput, hasBalance } = balanceData;

    if (!isOutput) {
      setIsBalanceSufficient(firstToken.value === '' || hasBalance);
      return;
    }
    if (isOutput && +firstToken.value > +firstTokenBalance) {
      setIsBalanceSufficient(false);
      return;
    }
    setIsBalanceSufficient(true);
  }, [
    balanceData,
    firstToken.value,
    firstTokenBalance,
    txLoading,
    firstToken.tokenSelected.symbol,
    isLoggedIn,
  ]);

  const handleCheckBalance = ({
    hasBalance,
    symbol,
    isOutput,
  }: {
    hasBalance: boolean;
    symbol: string;
    isOutput: boolean;
  }) => {
    setBalanceData({
      hasBalance: hasBalance,
      symbol: symbol,
      isOutput: isOutput,
    });
  };

  useEffect(
    () => setErrorMessage({ msg: '', relevantTokens: [] }),
    [firstToken],
  );

  // const estimateRate = () => {
  //   const { symbol: inputSymbol } = firstToken.tokenSelected;
  //   const { symbol: outputSymbol } = secondToken.tokenSelected;
  //   if (trade)
  //     return `1  ${inputSymbol} ≈ ${
  //       isWrapped ? '1' : parseFloat(trade.price).toFixed(5)
  //     } ${outputSymbol}`;

  //   return '-';
  // };

  return (
    <Box className="position-relative">
      <div className="swap-token">
        Swap Tokens{' '}
        <span className="swap-icon">
          <Button
            p="0"
            bg="transparent"
            border="none"
            minW="0"
            _active={{ border: 'none' }}
          >
            <img src={SettingSwap} onClick={toggleSettings} />
          </Button>
        </span>
      </div>
      <TabSelect
        index={swapIndex}
        setIndex={setSwapIndex}
        styleIndex={[2]}
        styleVariant="danger"
        names={tabNames}
        panels={swapPanels}
      />
      {/* <NewTokenAmountPanel
        onSelect={(item: Token, onClose) => handleChangeToken(item, onClose, 0)}
        inputValue={firstToken.value || ''}
        showPercentage
        context="token"
        showInputInUSD={showInputInUSD}
        setShowInputInUSD={setShowInputInUSD}
        token={firstToken?.tokenSelected || mockInputToken}
        setErrorMessage={setErrorMessage}
        isLoading={loadAmountInput1 && isLoading}
        handleCheckBalance={handleCheckBalance}
        tradeUSD={trade?.priceRoute?.srcUSD}
        errorMessage={
          errorMessage.relevantTokens
            ? errorMessage.relevantTokens.includes(
                firstToken.tokenSelected.symbol,
              ) || errorMessage.relevantTokens.length === 0
              ? errorMessage.msg
              : ''
            : ''
        }
        onChange={({ value }) => {
          onChangeNumberInput(value, 0);
        }}
      />

      <Center>
        <SwapIconButton
          horizontalRotateOnMdScreenSize={false}
          m="8px auto"
          onClick={swapAmountPanel}
        />
      </Center>

      <NewTokenAmountPanel
        setErrorMessage={setErrorMessage}
        onSelect={(item: Token, onClose) => handleChangeToken(item, onClose, 1)}
        inputValue={secondToken.value || ''}
        context="token"
        tradeUSD={trade?.priceRoute?.destUSD}
        showInputInUSD={showInputInUSD}
        setShowInputInUSD={setShowInputInUSD}
        token={secondToken?.tokenSelected || mockInputToken}
        handleCheckBalance={handleCheckBalance}
        isLoading={loadAmountInput2 && isLoading}
        isOutput
        priceDiff={trade ? +trade.estimatedPriceImpact : undefined}
        onChange={({ value }) => {
          onChangeNumberInput(value, 1);
        }}
      /> */}

      {apiCallError ? (
        <Alert mt="16px" status="error" borderRadius="4px" bg="dangerBg">
          <AlertIcon />
          <AlertDescription ml="-5px">{apiCallError}</AlertDescription>
        </Alert>
      ) : null}

      {/* <Button
        size="lg"
        mt="16px"
        w="full"
        isLoading={isLoading || txLoading}
        loadingText={loaderText}
        onClick={buttonAction}
      >
        {isLoggedIn ? swapLegend() : t(`home.common.connectWallet`)}
      </Button>  */}

      <ConnectWallet isOpen={isOpen} dismiss={onClose} />
    </Box>
  );
}
