import {
  Box,
  Button,
  Flex,
  HStack,
  NumberInput,
  NumberInputField,
  Skeleton,
  Spacer,
  Text,
  Center,
} from '@chakra-ui/react';
import { Percentages } from 'app/components/Percentages';
import { PriceDiffIndicator } from 'app/components/PriceDiffIndicator';
import { TokenSelection } from 'app/components/TokenSelection';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { resolveRoutePath } from 'app/router/routes';
import { getRoundedSFs, validateInput } from 'app/utils';
import { parseUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import SwapIconNew from 'app/assets/images/swap-icon.svg';
import {
  approve,
  checkTokenAllowance,
  redeem,
  transactionResponse,
} from 'utils/web3';

export default function RedeemPanel(props) {
  const { addToQueue } = Web3Monitoring();
  const [loaderText, setLoaderText] = useState('Loading');
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [numberInputValue, setNumberInputValue] = useState('0');
  const balance = props.bondingCurveData?.accountTOKEN / 1e18;
  const priceBase =
    (props.bondingCurveData?.priceBASE * Number(numberInputValue)) / 1e36;
  const priceTOKEN =
    (props.bondingCurveData?.priceTOKEN * Number(numberInputValue)) / 1e36;

  const getDisabledStatus = (): boolean => {
    const DISABLED = true;
    const NOT_DISABLED = false;
    if (numberInputValue === '0' || numberInputValue === '') return DISABLED;
    if (Number(numberInputValue) === 0) return DISABLED;
    if (isLoadingButton) return DISABLED;
    if (Number(numberInputValue) > balance) return DISABLED;
    return NOT_DISABLED;
  };
  const approveToken = async number => {
    setLoaderText('Approving');
    try {
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
    setIsLoadingButton(true);
    let approveSuccess: boolean | undefined = true;
    let number;
    number = parseUnits(numberInputValue, 18);
    approveSuccess = await approveToken(number);

    if (approveSuccess) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const allowance = await checkTokenAllowance(
        props.account,
        '0x8d6abe4176f262F79317a1ec60B9C6e070a2142a',
      );
      if (allowance / 1e18 < number / 1e18) {
        window.alert(
          'Insufficient allowance. Please approve a higher allowance.',
        );
      } else {
        try {
          setLoaderText('Redeeming');
          const tx = await redeem(number, props.account);
          const response = transactionResponse('swap.redeem', {
            operation: 'SWAP',
            tx: tx,
            uniqueMessage: {
              text: 'redeem',
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
      <Flex>
        <div className="float-left w-100">
          <div className="panel-text float-left"> You're selling</div>
          <div className="panel-text float-right">
            Available Balance: {balance} TKN
          </div>
        </div>
      </Flex>

      <Flex bg="transparent" flexDirection="column" w="full" {...props}>
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
            src={resolveRoutePath(`images/tokens/ftm.png`)}
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
                    ≈ ${priceTOKEN}
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
            setNumberInputValue(value);
          }}
          decimals={18}
          symbol={'WFTM'}
          balance={balance.toString()}
        />
      </Flex>
      <Center mt="5">
        <div className="border-line"></div>
        <img src={SwapIconNew} className="swapicon" />
      </Center>
      <Flex mt="5">
        <div className="float-left w-100">
          <div className="panel-text float-left"> You receive</div>
          <div className="panel-text float-right">
            Available Balance:{balance} TKN
          </div>
        </div>
      </Flex>
      {/* <Flex>
        <p>To recieve </p>
        <Spacer />
        <p> {numberInputValue} WFTM </p>
      </Flex> */}
      <Flex bg="transparent" flexDirection="column" w="full" {...props}>
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
            src={resolveRoutePath(`images/tokens/ftm.png`)}
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
                    ≈ ${priceTOKEN}
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
      </Flex>
      {/* <Flex>
        <Spacer />
        <Text as="div" fontSize="h5" color="grayDarker" mr="spacing02">
          <Flex align="center" justify="center" sx={{ gap: '0.2rem' }}>
            <Text>≈ ${priceBase}</Text>
          </Flex>
        </Text>
      </Flex> */}
      <Button
        w="full"
        onClick={buttonAction}
        className="buy-button"
        disabled={getDisabledStatus()}
        loadingText={loaderText}
        isLoading={isLoadingButton}
      >
        Redeem WFTM
      </Button>
    </Box>
  );
}
