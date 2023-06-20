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
import { buyToken } from 'utils/web3/actions/inspirit';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { Percentages } from 'app/components/Percentages';
import { PriceDiffIndicator } from 'app/components/PriceDiffIndicator';
import { TokenSelection } from 'app/components/TokenSelection';
import { resolveRoutePath } from 'app/router/routes';
import { getRoundedSFs, validateInput } from 'app/utils';
import { useEffect, useState } from 'react';
import { approve, Test, checkBaseAllowance } from 'utils/web3';
import { BigNumber } from 'ethers';

export default function BuyPanel(props) {
  const [isLoadingOutput, setIsLoadingOutput] = useState(false);
  const [isLoadingInput, setIsLoadingInput] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [buyIn, setBuyIn] = useState(false);
  const [buyOut, setBuyOut] = useState(false);
  const [numberInputValue, setNumberInputValue] = useState('0');
  const [numberOutputValue, setNumberOutputValue] = useState('0');
  const [price, setPrice] = useState('≈ $0');
  const balance = props.bondingCurveData?.accountBASE / 1e18;
  const balanceToken = props.bondingCurveData?.accountTOKEN / 1e18;
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
    if (isLoadingButton) return DISABLED;
    if (Number(numberInputValue) > balance) return DISABLED;

    return NOT_DISABLED;
  };

  const quote = async (input, slippage, check) => {
    const newSlippage = 1000 - slippage * 10;
    const validInput = validateInput(input, 18);

    const result = await Test(props.account, validInput, newSlippage, false);
    if (check) {
      return result?.quoteBuyIn;
    } else {
      return result?.quoteBuyOut;
    }
  };

  const setPriceValue = input => {
    const validInput = validateInput(input, 18);
    setNumberInputValue(validInput);
    const price =
      (props.bondingCurveData?.priceBASE * Number(validInput)) / 1e36;
    setPrice(`≈ $${price}`);
  };

  const setInputValue = async input => {
    if (input === '0' || input === '') {
      return;
    }
    let result;
    setIsLoadingInput(true);
    setBuyIn(false);
    setBuyOut(true);
    try {
      result = await quote(input, props.slippage, false);
      setQuoteBuyOut({
        output: result.output,
        slippage: result.slippage,
        minOutput: result.minOutput,
      });
      setNumberInputValue(String(result.output / 1e18));
      setIsLoadingInput(false);
    } catch (e) {
      setNumberInputValue(String(0));
      setIsLoadingInput(false);
      return;
    }
  };

  const setOutputValue = async input => {
    let result;
    setBuyIn(true);
    setBuyOut(false);
    setIsLoadingOutput(true);
    try {
      result = await quote(input, props.slippage, true);
      setQuoteBuyIn({
        output: result.output,
        slippage: result.slippage,
        minOutput: result.minOutput,
      });
    } catch (e) {
      setNumberOutputValue(String(0));
      setIsLoadingOutput(false);
      return;
    }
    if (result) {
      setNumberOutputValue(String(result.output / 1e18));
      setIsLoadingOutput(false);
    }
  };

  const buttonAction = async () => {
    setIsLoadingButton(true);
    let number;
    if (buyIn) {
      number = parseUnits(numberInputValue, 18);
    } else {
      number = parseUnits(numberOutputValue, 18);
    }
    try {
      const result = await approve(
        '0xAa171Ad6f4eD52ED74707300aD90bDAEE8398773',
        '0x8d6abe4176f262F79317a1ec60B9C6e070a2142a',
        number,
        'fakeBASE',
      );
      if (result) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const allowance = await checkBaseAllowance(
          props.account,
          '0x8d6abe4176f262F79317a1ec60B9C6e070a2142a',
        );
        if (allowance) {
          console.log(Number(allowance));

          if (allowance < number) {
            window.alert(
              'Insufficient allowance. Please approve a higher allowance.',
            );
          } else {
            await buyToken(
              number,
              quoteBuyIn.minOutput,
              props.deadline,
              props.account,
            );
          }
        }
      }
      setIsLoadingButton(false);
    } catch (e) {
      setIsLoadingButton(false);
    }
  };
  const handleBalanceClick = () => {
    setPriceValue(balance);
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
                max={balance}
                border="none"
                value={numberInputValue}
                onChange={value => {
                  if (Number(value) <= balance) {
                    setPriceValue(value);
                    setOutputValue(value);
                  }
                }}
                // onKeyDown={e => {
                //   if (e.code === 'End' || e.code === 'Home') {
                //     return handleInput(inputValue);
                //   }
                // }}
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
            symbol={'WFTM'}
            src={resolveRoutePath(`images/tokens/FTM.png`)}
          />
        </HStack>

        {true ? (
          <Flex w="full" align="center" justify="space-between">
            <Flex>
              <Text as="div" fontSize="h5" color="grayDarker" mr="spacing02">
                <Flex align="center" justify="center" sx={{ gap: '0.2rem' }}>
                  <Text
                  // _hover={{ cursor: 'pointer' }}
                  >
                    {price}
                  </Text>
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
            setPriceValue(value);
            setOutputValue(value);
          }}
          decimals={18}
          symbol={'WFTM'}
          balance={balance.toString()}
        />
      </Flex>

      <Center>
        <SwapIconButton horizontalRotateOnMdScreenSize={false} m="8px auto" />
      </Center>

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
                max={balance}
                border="none"
                value={numberOutputValue}
                onChange={value => {
                  if (Number(value) <= balance) {
                    setNumberOutputValue(value);
                    setInputValue(value);
                  }
                }}
                // onKeyDown={e => {
                //   if (e.code === 'End' || e.code === 'Home') {
                //     return handleInput(inputValue);
                //   }
                // }}
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
                  <Text>~${priceToken}</Text>
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
      <Button
        disabled={getDisabledStatus()}
        isLoading={isLoadingButton}
        size="lg"
        mt="16px"
        w="full"
        onClick={buttonAction}
      >
        Buy
      </Button>
    </Box>
  );
}
