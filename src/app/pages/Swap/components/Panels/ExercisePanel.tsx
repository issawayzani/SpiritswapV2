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
import { resolveRoutePath } from 'app/router/routes';
import { getRoundedSFs } from 'app/utils';
import { useState } from 'react';

export default function ExercisePanel(props) {
  const [numberInputValue, setNumberInputValue] = useState('0');
  const [price, setPrice] = useState('≈ $0');
  const balance = props.bondingCurveData?.accountOTOKEN / 1e18;
  const balanceBase = props.bondingCurveData?.accountBASE / 1e18;
  const priceToken =
    (Number(numberInputValue) * props.bondingCurveData?.priceTOKEN) / 1e36;
  const priceBase =
    (Number(numberInputValue) * props.bondingCurveData?.priceOTOKEN) / 1e36;
  const setPriceValue = input => {
    const price = (props.bondingCurveData?.priceOTOKEN * input) / 1e36;
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
      <p> Exercise oSOULC to get SOULC</p>

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
                Balance: {balance}
              </Text>
            </Skeleton>
          </Flex>
        ) : null}

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
      <Center>
        <PlusIcon horizontalRotateOnMdScreenSize={false} m="8px auto" />
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
                // value={
                //   // inputValue === 'NaN'
                //   //   ? 0
                //   //   : showInputInUSD
                //   //   ? formatInputUSD()
                //   //   : inputValue
                // }
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
                  <Text>~${priceBase}</Text>
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
        <p>You will recieve </p>
        <Spacer />
        <p> {numberInputValue} SOUL </p>
      </Flex>
      <Flex>
        <Spacer />
        <Text as="div" fontSize="h5" color="grayDarker" mr="spacing02">
          <Flex align="center" justify="center" sx={{ gap: '0.2rem' }}>
            <Text>~${priceToken}</Text>
          </Flex>
        </Text>
      </Flex>

      <Button size="lg" mt="16px" w="full" onClick={buttonAction}>
        Redeem
      </Button>
    </Box>
  );
}
