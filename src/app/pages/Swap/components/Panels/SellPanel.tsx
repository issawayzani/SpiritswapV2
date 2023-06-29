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
} from '@chakra-ui/react';
import { SwapIconButton } from 'app/assets/icons';
import { buyToken, sellToken } from 'utils/web3/actions/inspirit';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { Percentages } from 'app/components/Percentages';
import { PriceDiffIndicator } from 'app/components/PriceDiffIndicator';
import { TokenSelection } from 'app/components/TokenSelection';
import { resolveRoutePath } from 'app/router/routes';
import { formatAmount, getRoundedSFs, validateInput } from 'app/utils';
import { useEffect, useState } from 'react';
import {
  approve,
  Test,
  checkBaseAllowance,
  checkTokenAllowance,
  transactionResponse,
} from 'utils/web3';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';

export default function SellPanel(props) {
  const [isLoadingOutput, setIsLoadingOutput] = useState(false);
  const [isLoadingInput, setIsLoadingInput] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [SellIn, setBuyIn] = useState(false);
  const { addToQueue } = Web3Monitoring();
  const [numberInputValue, setNumberInputValue] = useState('0');
  const [numberOutputValue, setNumberOutputValue] = useState('0');
  const balance = props.bondingCurveData?.accountBASE / 1e18;
  const balanceToken = props.bondingCurveData?.accountTOKEN / 1e18;
  const maxMarketSell = props.bondingCurveData?.maxMarketSell / 1e18;
  const max = Math.min(balanceToken || maxMarketSell);
  const priceBase =
    (props.bondingCurveData?.priceBASE * Number(numberInputValue)) / 1e36;
  const priceToken =
    (props.bondingCurveData?.priceTOKEN * Number(numberOutputValue)) / 1e36;
  const [quoteSellIn, setQuoteSellIn] = useState({
    output: 0,
    slippage: 0,
    minOutput: 0,
  });
  const [quoteSellOut, setQuoteSellOut] = useState({
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
    if (Number(numberInputValue) > max) return DISABLED;

    return NOT_DISABLED;
  };

  const quote = async (input, slippage, check) => {
    const newSlippage = 1000 - slippage * 10;
    const validInput = validateInput(input, 18);

    const result = await Test(props.account, validInput, newSlippage);
    if (check) {
      return result?.quoteSellIn;
    } else {
      return result?.quoteSellOut;
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
    try {
      result = await quote(input, props.slippage, false);
    } catch (e) {
      setNumberInputValue(String(0));
      setIsLoadingInput(false);
      return;
    }
    if (result) {
      setQuoteSellOut({
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
    if (input === '') {
      setNumberOutputValue('');
      return;
    }
    let result;
    setBuyIn(true);
    setIsLoadingOutput(true);
    try {
      result = await quote(input, props.slippage, true);
    } catch (e) {
      setNumberOutputValue(String(''));
      setIsLoadingOutput(false);
      return;
    }
    if (result) {
      setQuoteSellIn({
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
        '0x8d6abe4176f262F79317a1ec60B9C6e070a2142a',
        '0x8d6abe4176f262F79317a1ec60B9C6e070a2142a',
        number,
        'token',
      );

      const response = transactionResponse('swap.approve', {
        operation: 'APPROVE',
        tx: tx,
        uniqueMessage: {
          text: 'Approving',
          secondText: 'TOKEN',
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
    let number;
    let minOutput;
    let output;
    let numberInput;
    setIsLoadingButton(true);

    if (SellIn) {
      number = parseUnits(numberInputValue, 18);
      minOutput = quoteSellIn.minOutput;
      output = quoteSellIn.output;
      numberInput = numberInputValue;
    } else {
      number = parseUnits(numberOutputValue, 18);
      minOutput = quoteSellOut.minOutput;
      output = quoteSellOut.output;
      numberInput = numberOutputValue;
    }
    try {
      approveSuccess = await approveToken(number);

      if (approveSuccess) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const allowance = await checkTokenAllowance(
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
            const tx = await sellToken(
              number,
              minOutput,
              props.deadline,
              props.account,
            );
            const response = transactionResponse('swap.process', {
              operation: 'SWAP',
              tx: tx,
              inputSymbol: 'Token',
              inputValue: formatAmount(numberInput, 18),
              outputSymbol: 'WFTM',
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
      <p> You're paying</p>

      <Flex
        bg="bgBoxLighter"
        py="spacing05"
        px="spacing04"
        flexDirection="column"
        w="full"
        borderRadius="md"
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
                max={max}
                border="none"
                value={numberInputValue}
                onChange={value => {
                  if (Number(value) <= max) {
                    const validInput = validateInput(value, 18);
                    if (validInput === '0') {
                      setNumberInputValue('0.');
                    } else {
                      setNumberInputValue(validInput);
                    }
                    if (Number(validInput) === 0) {
                      setNumberOutputValue('');
                    } else {
                      setOutputValue(validInput);
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
                  _placeholder={{ color: 'gray' }}
                />
              </NumberInput>
            </Skeleton>
          )}

          <TokenSelection
            symbol={'SOUL'}
            src={resolveRoutePath(`images/tokens/SOULC.png`)}
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
                Balance: {max}
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
          symbol={'SOUL'}
          balance={max.toString()}
        />
      </Flex>

      <Center>
        <SwapIconButton horizontalRotateOnMdScreenSize={false} m="8px auto" />
      </Center>
      <p> To receive</p>
      <Flex
        bg="bgBoxLighter"
        py="spacing05"
        px="spacing04"
        flexDirection="column"
        w="full"
        borderRadius="md"
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
                max={max + 0.5 * 1e18}
                border="none"
                value={numberOutputValue === '0' ? '' : numberOutputValue}
                onChange={value => {
                  if (Number(value) <= max + 0.5 * 1e18) {
                    const validInput = validateInput(value, 18);
                    if (validInput === '0') {
                      setNumberOutputValue('0.');
                    } else {
                      setNumberOutputValue(validInput);
                    }
                    if (Number(validInput) === 0) {
                      setNumberInputValue('');
                    } else {
                      setInputValue(validInput);
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
                  _placeholder={{ color: 'gray' }}
                />
              </NumberInput>
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
              <Text as="div" fontSize="sm" color="gray" mr="spacing04">
                Balance: {balance}
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
      <Button
        disabled={getDisabledStatus()}
        isLoading={isLoadingButton}
        size="lg"
        mt="16px"
        w="full"
        onClick={buttonAction}
      >
        Sell
      </Button>
    </Box>
  );
}
