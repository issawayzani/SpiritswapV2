import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  NumberInput,
  NumberInputField,
  Skeleton,
  Spinner,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
import { SwapProps } from '../../Swap.d';
import { SlippageIcon, SwapIconButton } from 'app/assets/icons';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { formatAmount } from 'app/utils';
import { buyToken } from 'utils/web3/actions/inspirit';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { Percentages } from 'app/components/Percentages';
import { PriceDiffIndicator } from 'app/components/PriceDiffIndicator';
import { TokenSelection } from 'app/components/TokenSelection';
import { resolveRoutePath } from 'app/router/routes';
import { getRoundedSFs, validateInput } from 'app/utils';
import { useEffect, useState } from 'react';
import SwapIconNew from 'app/assets/images/swap-icon.svg';
import {
  approve,
  Test,
  checkBaseAllowance,
  transactionResponse,
} from 'utils/web3';
import { BigNumber } from 'ethers';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { useTranslation } from 'react-i18next';

export default function BuyPanel(props) {
  const [isLoadingOutput, setIsLoadingOutput] = useState(false);
  const [isLoadingInput, setIsLoadingInput] = useState(false);
  const { isLoading: txLoading, loadingOff, loadingOn } = UseIsLoading();
  const { addToQueue } = Web3Monitoring();
  const settingsTranslationPath = 'swap.settings';
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [buyIn, setBuyIn] = useState(false);
  const [quoteSlippage, setQuoteSlippage] = useState(0);
  const [buyOut, setBuyOut] = useState(false);
  const [numberInputValue, setNumberInputValue] = useState('0');
  const [numberOutputValue, setNumberOutputValue] = useState('0');
  const balance = props.bondingCurveData?.accountBASE / 1e18;
  const balanceToken = props.bondingCurveData?.accountTOKEN / 1e18;
  const { t } = useTranslation();
  const { slippage, isLoading, toggleSettings }: SwapProps = props;
  const priceBase =
    (props.bondingCurveData?.priceBASE * Number(numberInputValue)) / 1e36;
  const priceToken =
    (props.bondingCurveData?.priceTOKEN * Number(numberOutputValue)) / 1e36;
  const [quoteBuyIn, setQuoteBuyIn] = useState({
    output: 0,
    slippage: 0,
    minOutput: 0,
  });
  const [quoteBuyOut, setQuoteBuyOut] = useState({
    output: 0,
    slippage: 0,
    minOutput: 0,
  });

  const getDisabledStatus = (): boolean => {
    const DISABLED = true;
    const NOT_DISABLED = false;
    if (numberInputValue === '0' || numberInputValue === '') return DISABLED;
    if (numberOutputValue === '0' || numberOutputValue === '') return DISABLED;
    if (Number(numberInputValue) === 0) return DISABLED;
    if (isLoadingButton) return DISABLED;
    if (Number(numberInputValue) > balance) return DISABLED;

    return NOT_DISABLED;
  };

  const quote = async (input, slippage, check) => {
    const newSlippage = 1000 - slippage * 10;
    const validInput = validateInput(input, 18);

    const result = await Test(props.account, validInput, newSlippage);
    if (check) {
      return result?.quoteBuyIn;
    } else {
      return result?.quoteBuyOut;
    }
  };

  const setInputValue = async input => {
    if (input === '0' || input === '') {
      setNumberInputValue('');
      return;
    }
    let result;
    setIsLoadingInput(true);
    setBuyIn(false);
    setBuyOut(true);
    try {
      result = await quote(input, props.slippage, false);
    } catch (e) {
      setNumberInputValue(String(0));
      setIsLoadingInput(false);
      return;
    }
    if (result) {
      setQuoteBuyOut({
        output: result.output,
        slippage: result.slippage,
        minOutput: result.minOutput,
      });
      props.setQuoteSlippage(result?.slippage / 1e18);
      setNumberInputValue(String(result.output / 1e18));
      setIsLoadingInput(false);
    }
    setIsLoadingInput(false);
  };

  const setOutputValue = async input => {
    console.log(input);
    console.log(Number(input));
    if (input === '') {
      setNumberOutputValue('');
      return;
    }
    let result;
    setBuyIn(true);
    setBuyOut(false);
    setIsLoadingOutput(true);
    try {
      result = await quote(input, props.slippage, true);
    } catch (e) {
      setNumberOutputValue(String(''));
      setIsLoadingOutput(false);
      return;
    }
    if (result) {
      setQuoteBuyIn({
        output: result.output,
        slippage: result.slippage,
        minOutput: result.minOutput,
      });
      props.setQuoteSlippage(result?.slippage / 1e18);
      setNumberOutputValue(String(result.output / 1e18));
      setIsLoadingOutput(false);
    }
    setIsLoadingOutput(false);
  };

  const approveToken = async number => {
    try {
      // setIsApproving(true);
      const tx = await approve(
        '0xAa171Ad6f4eD52ED74707300aD90bDAEE8398773',
        '0x8d6abe4176f262F79317a1ec60B9C6e070a2142a',
        number,
        'fakeBASE',
      );

      const response = transactionResponse('swap.approve', {
        operation: 'APPROVE',
        tx: tx,
        uniqueMessage: {
          text: 'Approving',
          secondText: 'BASE',
        },
      });

      addToQueue(response);
      await tx.wait();
      return true;
    } catch (error) {
      return false;
    }
  };

  const buttonAction = async () => {
    let approveSuccess: boolean | undefined = true;
    setIsLoadingButton(true);
    let number;
    let minOutput;
    let output;
    let numberInput;
    if (buyIn) {
      number = parseUnits(numberInputValue, 18);
      minOutput = quoteBuyIn.minOutput;
      output = quoteBuyIn.output;
      numberInput = numberInputValue;
    } else {
      number = parseUnits(numberOutputValue, 18);
      minOutput = quoteBuyOut.minOutput;
      output = quoteBuyOut.output;
      numberInput = numberOutputValue;
    }
    try {
      approveSuccess = await approveToken(number);

      if (approveSuccess) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const allowance = await checkBaseAllowance(
          props.account,
          '0x8d6abe4176f262F79317a1ec60B9C6e070a2142a',
        );
        if (allowance) {
          console.log(allowance / 1e18);
          console.log(number / 1e18);
          if (allowance / 1e18 < number / 1e18) {
            window.alert(
              'Insufficient allowance. Please approve a higher allowance.',
            );
          } else {
            const tx = await buyToken(
              number,
              minOutput,
              props.deadline,
              props.account,
            );

            const response = transactionResponse('swap.process', {
              operation: 'SWAP',
              tx: tx,
              inputSymbol: 'WFTM',
              inputValue: buyIn
                ? formatAmount(numberInputValue, 18)
                : formatAmount(numberOutputValue, 18),
              outputSymbol: 'TOKEN',
              outputValue: formatAmount(output, 18),
            });
            addToQueue(response);
            await response.tx.wait();
          }
        }
      }
      setIsLoadingButton(false);
    } catch (e) {
      setIsLoadingButton(false);
    }
  };
  const handleBalanceClick = () => {
    setNumberInputValue(balance.toString());
  };
  return (
    <Box>
      <Flex>
        <div className="float-left w-100">
          <div className="panel-text float-left"> You're paying</div>
          <div className="panel-text float-right">
            Available Balance: 0.00 TKN
          </div>
        </div>
      </Flex>

      <Flex
        bg="transparent"
        className="bottommargin"
        flexDirection="column"
        w="full"
        {...props}
      >
        <HStack align="center" justify="space-between" w="100%">
          {isLoadingInput ? (
            <Spinner /> // Show the spinner if isLoading is true
          ) : (
            <Skeleton
              startColor="grayBorderBox"
              endColor="bgBoxLighter"
              w="60%"
              isLoaded={true}
              flexGrow={1}
            >
              <NumberInput
                clampValueOnBlur={false}
                max={balance}
                border="none"
                className="number-input"
                value={numberInputValue}
                onChange={value => {
                  if (Number(value) <= balance) {
                    const validInput = validateInput(value, 18);
                    if (validInput === '0') {
                      setNumberInputValue('0.');
                    } else {
                      setNumberInputValue(validInput);
                    }
                    if (Number(validInput) === 0) {
                      setNumberOutputValue('');
                    } else {
                      setOutputValue(value);
                    }
                  }
                }}
                onKeyDown={event => {
                  if (event.key === 'Backspace' && numberInputValue === '0.') {
                    setNumberInputValue('');
                    setNumberOutputValue('');
                  } else if (
                    event.key === 'Backspace' &&
                    numberInputValue.startsWith('.') &&
                    numberInputValue.length === 2
                  ) {
                    setNumberInputValue('');
                    setNumberOutputValue('');
                  }
                }}
                // isInvalid={!!errorMessage}
              >
                <NumberInputField
                  w="full"
                  inputMode="numeric"
                  paddingInline="8px"
                  placeholder="0"
                  fontSize="xl2"
                  border="none"
                  className="number-input"
                  bg="transparent"
                  _placeholder={{ color: '#A9CDFF' }}
                />
              </NumberInput>
              <Text className="small-price">= $0.00</Text>
            </Skeleton>
          )}

          <TokenSelection
            symbol={'WFTM'}
            src={resolveRoutePath(`images/tokens/FTM.png`)}
          />
        </HStack>

        {true ? (
          <Flex w="full" align="center" justify="space-between">
            <Flex>
              <Text as="div" fontSize="h5" color="grayDarker" mr="spacing02">
                <Flex align="center" justify="center" sx={{ gap: '0.2rem' }}>
                  <Text>≈ ${priceBase}</Text>
                </Flex>
              </Text>
            </Flex>
            <Skeleton isLoaded={true}>
              <Text
                as="div"
                fontSize="sm"
                color="gray"
                mr="spacing04"
                cursor="pointer"
                onClick={handleBalanceClick}
              >
                Balance: {balance}
              </Text>
            </Skeleton>
          </Flex>
        ) : null}

        <Percentages
          onChange={({ value }) => {
            setOutputValue(value);
            setNumberInputValue(value);
          }}
          decimals={18}
          symbol={'WFTM'}
          balance={balance.toString()}
        />
      </Flex>

      <Center>
        <div className="border-line"></div>
        <img src={SwapIconNew} className="swapicon" />
      </Center>
      <Flex mt="5">
        <div className="float-left w-100">
          <div className="panel-text float-left"> You receive</div>
          <div className="panel-text float-right">
            Available Balance: 0.00 TKN
          </div>
        </div>
      </Flex>
      <Flex
        bg="transparent"
        className="topmargin"
        flexDirection="column"
        w="full"
        {...props}
      >
        <HStack align="center" justify="space-between" w="100%">
          {isLoadingOutput ? (
            <Spinner /> // Show the spinner if isLoading is true
          ) : (
            <Skeleton
              startColor="grayBorderBox"
              endColor="bgBoxLighter"
              w="60%"
              isLoaded={true}
              flexGrow={1}
            >
              <NumberInput
                clampValueOnBlur={false}
                max={balance}
                border="none"
                className="number-input"
                value={numberOutputValue}
                onChange={value => {
                  if (Number(value) <= balance && value !== '0') {
                    const validInput = validateInput(value, 18);
                    if (validInput === '0') {
                      setNumberOutputValue('0.');
                    } else {
                      setNumberOutputValue(validInput);
                    }
                    if (Number(validInput) === 0) {
                      setNumberInputValue('');
                    } else {
                      setInputValue(value);
                    }
                  }
                }}
                onKeyDown={event => {
                  if (event.key === 'Backspace' && numberInputValue === '0.') {
                    setNumberInputValue('');
                    setNumberOutputValue('');
                  } else if (
                    event.key === 'Backspace' &&
                    numberInputValue.startsWith('.') &&
                    numberInputValue.length === 2
                  ) {
                    setNumberInputValue('');
                    setNumberOutputValue('');
                  }
                }}
              >
                <NumberInputField
                  w="full"
                  inputMode="numeric"
                  paddingInline="8px"
                  placeholder="0"
                  fontSize="xl2"
                  className="number-input"
                  _placeholder={{ color: '#A9CDFF' }}
                />
              </NumberInput>
              <Text className="small-price">= $0.00</Text>
            </Skeleton>
          )}

          <TokenSelection
            symbol={'WFTM'}
            src={resolveRoutePath(`images/tokens/FTM.png`)}
          />
        </HStack>

        {true ? (
          <Flex w="full" align="center" justify="space-between">
            <Flex>
              <Text as="div" fontSize="h5" color="grayDarker" mr="spacing02">
                <Flex align="center" justify="center" sx={{ gap: '0.2rem' }}>
                  <Text>≈ ${priceToken}</Text>
                </Flex>
              </Text>
            </Flex>
            <Skeleton isLoaded={true}>
              <Text as="div" fontSize="sm" color="gray" mr="spacing04">
                Balance: {balanceToken}
              </Text>
            </Skeleton>
          </Flex>
        ) : null}

        {/* <Percentages
          onChange={value => handleInput(value.value)}
          decimals={18}
          symbol={'SOULC'}
          balance={'0'}
        /> */}

        {/* {children} */}
      </Flex>
      <SimpleGrid columns={2} w="full" mb="5">
        <Text className="slippage">Slippage</Text>
        <Skeleton
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          isLoaded={!isLoading}
        >
          <Text className="slippage" textAlign="right">
            {quoteSlippage}
          </Text>
        </Skeleton>

        <Flex align="center" sx={{ gap: '0.3rem' }}>
          <Text className="slippage">
            {t(`${settingsTranslationPath}.slippageToleranceLabel`)}{' '}
          </Text>
          {/* <QuestionHelper
            title={t(`${settingsTranslationPath}.slippageToleranceLabel`)}
            text={t(`${settingsTranslationPath}.slippageExplanation`)}
          /> */}
        </Flex>
        <Text className="slippage" textAlign="right">
          {slippage}
        </Text>
      </SimpleGrid>
      <Button
        disabled={getDisabledStatus()}
        isLoading={isLoadingButton}
        className="buy-button"
        w="full"
        onClick={buttonAction}
      >
        Buy WFTM
      </Button>
    </Box>
  );
}
