import {
  Box,
  Button,
  Flex,
  HStack,
  NumberInput,
  NumberInputField,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { Percentages } from 'app/components/Percentages';
import { PriceDiffIndicator } from 'app/components/PriceDiffIndicator';
import { TokenSelection } from 'app/components/TokenSelection';
import { resolveRoutePath } from 'app/router/routes';
import { getRoundedSFs } from 'app/utils';
import { useState } from 'react';

export default function BorrowRepayPanel(props) {
  const [numberInputValue, setNumberInputValue] = useState('0');
  const [price, setPrice] = useState('≈ $0');
  let balance = 0;
  if (props.borrow) {
    balance = props.bondingCurveData?.accountBorrowCredit / 1e18;
  } else {
    balance = props.bondingCurveData?.accountBorrowDebt / 1e18;
  }

  const setPriceValue = input => {
    const price = (props.bondingCurveData?.priceBASE * input) / 1e36;
    setPrice(`≈ $${price}`);
  };

  const buttonAction = async () => {
    //need to deposit here
  };
  const handleBalanceClick = () => {
    setPriceValue(balance);
    setNumberInputValue(balance.toString());
  };
  return (
    <Box>
      {props.borrow && (
        <div>
          <p> Borrow FTM against staked position </p>
        </div>
      )}
      {props.repay && (
        <div>
          <p> Repay FTM to unlock staked position </p>
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
                // max={maxValue}
                border="none"
                value={numberInputValue}
                onChange={value => {
                  setNumberInputValue(value);
                  setPriceValue(value);
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
            symbol={'FTM'}
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
                {props.balanceText} {balance}
              </Text>
            </Skeleton>
          </Flex>
        ) : null}
        {/* {isLoading
      ? null
      : errorMessage && (
          <Text color="red.500" padding="spacing03 0">
            {t(errorMessage)}
          </Text>
        )} */}
        {/* {mustShowPercentage && !showConfirm && token && ( */}
        <Percentages
          onChange={({ value }) => {
            setNumberInputValue(value);
            setPriceValue(value);
          }}
          decimals={18}
          symbol={'FTM'}
          balance={balance.toString()}
        />

        {/* {children} */}
      </Flex>

      <Button size="lg" mt="16px" w="full" onClick={buttonAction}>
        {props.buttonText}
      </Button>
    </Box>
  );
}
