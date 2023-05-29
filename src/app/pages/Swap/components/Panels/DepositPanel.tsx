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

export default function DepositPanel(props) {
  const [numberInputValue, setNumberInputValue] = useState('0');
  const [price, setPrice] = useState('≈ $0');
  const balance = props.bondingCurveData?.accountTOKEN;
  const setPriceValue = input => {
    const price = (props.bondingCurveData?.priceTOKEN * input) / 1e36;
    setPrice(`≈ $${price}`);
  };

  const buttonAction = async () => {
    //need to deposit here
  };
  const handleBalanceClick = () => {
    setPriceValue(balance);
    setNumberInputValue(balance);
  };
  return (
    <Box>
      <p> Deposit SOULC to get vSOULC</p>

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
            symbol={'SOULC'}
            src={resolveRoutePath(`images/tokens/SOULC.png`)}
          />
        </HStack>
        {/* {poolPercentage && (
        <Text ml="4px" color="grayDarker" fontSize="h5">
          {poolPercentage}
        </Text>
      )} */}
        {/* {isSelectable && token ? (
        isOpen ? (
          <ModalToken
            tokens={tokens}
            commonTokens={commonTokens()}
            tokenSelected={token}
            bridge={bridge}
            onSelect={handleSelect}
            isOpen={isOpen}
            onClose={onClose}
            chainID={chainID}
            notSearchToken={notSearchToken}
          />
        ) : (
          ''
        )
      ) : isSelectable && bridge ? (
        <Skeleton
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          h="36px"
          w="120px"
        >
          <span>Loading</span>
        </Skeleton>
      ) : null}
    </HStack> 

      */}

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
          symbol={'SOULC'}
          balance={balance}
        />

        {/* {children} */}
      </Flex>
      <Button size="lg" mt="16px" w="full" onClick={buttonAction}>
        Deposit
      </Button>
    </Box>
  );
}
