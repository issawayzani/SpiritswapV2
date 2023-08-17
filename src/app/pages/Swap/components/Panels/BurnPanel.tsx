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
  burn,
  checkOTokenAllowance,
  transactionResponse,
} from 'utils/web3';

export default function BurnPanel(props) {
  const [numberInputValue, setNumberInputValue] = useState('0');
  const balance = props.bondingCurveData?.accountOTOKEN / 1e18;
  const votingPower = props.bondingCurveData?.accountVotingPower / 1e18;
  const [loaderText, setLoaderText] = useState('Loading');
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const { addToQueue } = Web3Monitoring();
  const getDisabledStatus = (): boolean => {
    const DISABLED = true;
    const NOT_DISABLED = false;
    if (numberInputValue === '0' || numberInputValue === '') return DISABLED;
    if (Number(numberInputValue) === 0) return DISABLED;
    if (Number(numberInputValue) > balance) return DISABLED;
    if (isLoadingButton) return DISABLED;

    return NOT_DISABLED;
  };
  const approveToken = async number => {
    setLoaderText('Approving');
    try {
      const tx = await approve(
        '0xc7a80762B3dcA438E81Ef6daA92E7323BE2e7C13',
        '0x0a5D71AbF79daaeE3853Db43c1Fb9c20195585f9',
        number,
        'OTOKEN',
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
    approveSuccess = await approveToken(number);

    if (approveSuccess) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(props.account);
      const allowance = await checkOTokenAllowance(
        props.account,
        '0x0a5D71AbF79daaeE3853Db43c1Fb9c20195585f9',
      );
      console.log(allowance / 1e18);
      if (allowance) {
        try {
          setLoaderText('Depositing');
          const tx = await burn(props.account, number);
          const response = transactionResponse('swap.burn', {
            operation: 'SWAP',
            tx: tx,
            uniqueMessage: {
              text: 'Burn OTOKEN',
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
    }
  };

  const handleBalanceClick = () => {
    setNumberInputValue(balance.toString());
  };
  return (
    <Box>
      <Flex>
        <div className="float-left w-100">
          <div className="panel-text float-left"> You're burning</div>
          <div className="panel-text float-right">
            Available Balance:{balance} TKN
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
        <Center mt="5">
          <div className="border-line"></div>
          <img src={SwapIconNew} className="swapicon" />
        </Center>
        <Flex mt="5">
          <div className="float-left w-100">
            <div className="panel-text float-left">
              {' '}
              To update voting power to
            </div>
            <div className="panel-text float-right">
              Current Voting Power: {votingPower} TKN
            </div>
          </div>
        </Flex>
        {/* <Flex>
          <p>To recieve </p>
          <Spacer />
          <p> {numberInputValue ? numberInputValue : '0'} Voting Power </p>
        </Flex>
        <Flex>
          <Spacer />
          <Text as="div" fontSize="h5" color="grayDarker" mr="spacing02">
            <Flex align="center" justify="center" sx={{ gap: '0.2rem' }}>
              <Text>Current: {votingPower}</Text>
            </Flex>
          </Text>
        </Flex> */}
      </Flex>
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
      <Button
        className="buy-button"
        w="full"
        mt="5"
        onClick={buttonAction}
        disabled={getDisabledStatus()}
        loadingText={loaderText}
        isLoading={isLoadingButton}
      >
        Burn WFTM
      </Button>
    </Box>
  );
}
