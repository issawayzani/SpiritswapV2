import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  NumberInput,
  NumberInputField,
  Skeleton,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { PlusIcon, SwapIconButton } from 'app/assets/icons';
import { Percentages } from 'app/components/Percentages';
import { PriceDiffIndicator } from 'app/components/PriceDiffIndicator';
import { TokenSelection } from 'app/components/TokenSelection';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { resolveRoutePath } from 'app/router/routes';
import { getRoundedSFs, validateInput } from 'app/utils';
import { parseUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import {
  approve,
  checkBaseAllowance,
  checkOTokenAllowance,
  exercise,
  transactionResponse,
} from 'utils/web3';

export default function ExercisePanel(props) {
  const { addToQueue } = Web3Monitoring();
  const [numberInputValue, setNumberInputValue] = useState('');
  const [price, setPrice] = useState('≈ $0');
  const [loaderText, setLoaderText] = useState('Loading');
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const balance = props.bondingCurveData?.accountOTOKEN / 1e18;
  const balanceBase = props.bondingCurveData?.accountBASE / 1e18;
  const priceToken =
    (Number(numberInputValue) * props.bondingCurveData?.priceTOKEN) / 1e36;
  const priceBase =
    (Number(numberInputValue) * props.bondingCurveData?.priceBASE) / 1e36;
  const priceOToken =
    (Number(numberInputValue) * props.bondingCurveData?.priceOTOKEN) / 1e36;

  const getDisabledStatus = (): boolean => {
    const DISABLED = true;
    const NOT_DISABLED = false;
    if (numberInputValue === '0' || numberInputValue === '') return DISABLED;
    if (Number(numberInputValue) === 0) return DISABLED;
    if (isLoadingButton) return DISABLED;
    if (Number(numberInputValue) > balance) return DISABLED;
    return NOT_DISABLED;
  };
  const approveToken = async (number, address, token) => {
    setLoaderText('Approving');
    try {
      const tx = await approve(
        address,
        '0x8d6abe4176f262F79317a1ec60B9C6e070a2142a',
        number,
        'token',
      );

      const response = transactionResponse('swap.approve', {
        operation: 'APPROVE',
        tx: tx,
        uniqueMessage: {
          text: 'Approving',
          secondText: token,
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
    setIsLoadingButton(true);
    let approveSuccess: boolean | undefined = true;
    let approveOtherSuccess: boolean | undefined = true;
    let number;
    number = parseUnits(numberInputValue, 18);
    approveSuccess = await approveToken(
      number,
      '0xc7a80762B3dcA438E81Ef6daA92E7323BE2e7C13',
      'OTOKEN',
    );
    approveOtherSuccess = await approveToken(
      number,
      '0xAa171Ad6f4eD52ED74707300aD90bDAEE8398773',
      'BASE',
    );
    if (approveSuccess && approveOtherSuccess) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const allowance = await checkOTokenAllowance(
        props.account,
        '0x8d6abe4176f262F79317a1ec60B9C6e070a2142a',
      );
      const secondAllowance = await checkBaseAllowance(
        props.account,
        '0x8d6abe4176f262F79317a1ec60B9C6e070a2142a',
      );
      if (
        allowance / 1e18 < number / 1e18 ||
        secondAllowance / 1e18 < number / 1e18
      ) {
        window.alert(
          'Insufficient allowance. Please approve a higher allowance.',
        );
      } else {
        try {
          setLoaderText('Exercising');
          const tx = await exercise(number, props.account);
          const response = transactionResponse('swap.exercise', {
            operation: 'SWAP',
            tx: tx,
            uniqueMessage: {
              text: 'Stake to earn',
              secondText: numberInputValue,
            },
          });

          addToQueue(response);
          await tx.wait();
        } catch {
          setLoaderText('loading');
          setIsLoadingButton(false);
        }
      }
    }

    setIsLoadingButton(false);
    setLoaderText('loading');
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
          {true && (
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
                    const validInput = validateInput(value, 18);
                    if (validInput === '0') {
                      setNumberInputValue('0.');
                    } else {
                      setNumberInputValue(validInput);
                    }
                  }
                }}
                onKeyDown={event => {
                  if (event.key === 'Backspace' && numberInputValue === '0.') {
                    setNumberInputValue('');
                  } else if (
                    event.key === 'Backspace' &&
                    numberInputValue.startsWith('.') &&
                    numberInputValue.length === 2
                  ) {
                    setNumberInputValue('');
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
            symbol={'oSOUL'}
            src={resolveRoutePath(`images/tokens/SOULC.png`)}
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
                    ≈ ${priceOToken}
                  </Text>
                </Flex>
              </Text>
              {/* {showDiff ? <PriceDiffIndicator amount={priceDiff || 0} /> : null} */}
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
            setNumberInputValue(value);
          }}
          decimals={18}
          symbol={'FTM'}
          balance={balance.toString()}
        />

        {/* {children} */}
      </Flex>
      <Center>
        <PlusIcon horizontalRotateOnMdScreenSize={false} m="8px auto" />
      </Center>
      <p>And </p>
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
          {true && (
            <Skeleton
              startColor="grayBorderBox"
              endColor="bgBoxLighter"
              w="60%"
              isLoaded={true}
              flexGrow={1}
            >
              <NumberInput
                clampValueOnBlur={false}
                isDisabled
                // max={maxValue}
                border="none"
                value={numberInputValue}
                // onChange={value => handleInput(value)}
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
            symbol={'FTM'}
            src={resolveRoutePath(`images/tokens/FTM.png`)}
          />
        </HStack>

        {true ? (
          <Flex w="full" align="center" justify="space-between">
            <Flex>
              <Text as="div" fontSize="h5" color="grayDarker" mr="spacing02">
                <Flex align="center" justify="center" sx={{ gap: '0.2rem' }}>
                  <Text> ≈ ${priceBase}</Text>
                </Flex>
              </Text>
            </Flex>
            <Skeleton isLoaded={true}>
              <Text as="div" fontSize="sm" color="gray" mr="spacing04">
                Balance: {balanceBase}
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

      <Flex>
        <p>To recieve </p>
        <Spacer />
        <p> {numberInputValue} SOUL </p>
      </Flex>
      <Flex>
        <Spacer />
        <Text as="div" fontSize="h5" color="grayDarker" mr="spacing02">
          <Flex align="center" justify="center" sx={{ gap: '0.2rem' }}>
            <Text>≈ ${priceToken}</Text>
          </Flex>
        </Text>
      </Flex>

      <Button
        size="lg"
        mt="16px"
        w="full"
        onClick={buttonAction}
        disabled={getDisabledStatus()}
        loadingText={loaderText}
        isLoading={isLoadingButton}
      >
        Redeem
      </Button>
    </Box>
  );
}
