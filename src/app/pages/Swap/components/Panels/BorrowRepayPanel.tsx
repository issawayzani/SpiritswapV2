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
} from '@chakra-ui/react';
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
  borrow,
  checkBaseAllowance,
  repay,
  transactionResponse,
} from 'utils/web3';

export default function BorrowRepayPanel(props) {
  const [numberInputValue, setNumberInputValue] = useState('');
  const [loaderText, setLoaderText] = useState('Loading');
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const { addToQueue } = Web3Monitoring();
  const balance = props.borrow
    ? props.bondingCurveData?.accountBorrowCredit / 1e18
    : props.bondingCurveData?.accountBorrowDebt / 1e18;
  const value = props.borrow
    ? props.bondingCurveData?.accountBorrowDebt / 1e18
    : props.bondingCurveData?.accountBorrowCredit / 1e18;
  const addedValue = Number(numberInputValue) + value;
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
    const number = parseUnits(numberInputValue, 18);
    if (props.repay) {
      approveSuccess = await approveToken(number);

      if (approveSuccess) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(props.account);
        const allowance = await checkBaseAllowance(
          props.account,
          '0x8d6abe4176f262F79317a1ec60B9C6e070a2142a',
        );
        if (allowance) {
          try {
            setLoaderText('Repaying');
            const tx = await repay(number);
            const response = transactionResponse('swap.repay', {
              operation: 'SWAP',
              tx: tx,
              uniqueMessage: {
                text: 'Repay BASE',
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
    } else {
      try {
        setLoaderText('Borrowing');
        const tx = await borrow(number);
        const response = transactionResponse('swap.borrow', {
          operation: 'SWAP',
          tx: tx,
          uniqueMessage: {
            text: 'Borrow BASE',
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
    setIsLoadingButton(false);
    setLoaderText('loading');
  };
  const handleBalanceClick = () => {
    setNumberInputValue(balance.toString());
  };
  return (
    <Box>
      {props.borrow ? (
        <div>
          <p> You're borrowing </p>
        </div>
      ) : (
        <div>
          <p> You're repaying </p>
        </div>
      )}

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
            symbol={'WFTM'}
            src={resolveRoutePath(`images/tokens/FTM.png`)}
          />
        </HStack>

        {true ? (
          <Flex w="full" align="center" justify="space-between">
            <Spacer />
            <Skeleton isLoaded={true}>
              <Text
                as="div"
                fontSize="sm"
                color="gray"
                mr="spacing04"
                cursor="pointer"
                onClick={handleBalanceClick}
              >
                {props.balanceText} {balance}
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

        <Flex>
          {props.borrow && <p>To update debt to </p>}
          {props.repay && <p>To update credit to </p>}
          <Spacer />
          <p>
            {' '}
            {numberInputValue === '0.' ||
            numberInputValue === '' ||
            Number(numberInputValue) === 0
              ? '0'
              : addedValue}{' '}
            {props.borrow ? 'Debt' : 'credit'}{' '}
          </p>
        </Flex>
        <Flex>
          <Spacer />
          <Text as="div" fontSize="h5" color="grayDarker" mr="spacing02">
            <Flex align="center" justify="center" sx={{ gap: '0.2rem' }}>
              <Text>Current: {value}</Text>
            </Flex>
          </Text>
        </Flex>
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
        {props.buttonText}
      </Button>
    </Box>
  );
}
