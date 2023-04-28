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

export default function ExercisePanel(props) {
  const handleInput = (value: string) => {
    //   if (!isLoggedIn) {
    //     handleLogin();
    //   }
    //   if (bridge === 'to') return;
    //   if (showConfirm) return;
    //   const numberValue = parseFloat(value);
    //   if (maxValue && numberValue > maxValue) {
    //     return (
    //       onChange && onChange({ tokenSymbol: token?.symbol, value: maxValue })
    //     );
    //   }
    //   const validInput = validateInput(value, token?.decimals);
    //   onChange &&
    //     onChange({
    //       tokenSymbol: token?.symbol,
    //       value: validInput,
    //     });
    //   if (balance) {
    //     handleCheckBalance?.({
    //       hasBalance:
    //         validInput !== ''
    //           ? parseFloat(validInput) <= parseFloat(balance)
    //           : true,
    //       symbol: token?.symbol,
    //       isOutput: isOutput,
    //     });
    //   }
  };
  const getBalanceValue = () => {
    if (true) {
      return `≈ $${getRoundedSFs('0')}`;
    }
    // if (usd && +usd > 0 && +usd < 0.01) return '<$0.01';
    // return `≈ $${parseFloat(usd).toFixed(2)}`;
  };

  const buttonAction = async () => {
    //need to deposit here
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
                // value={
                //   // inputValue === 'NaN'
                //   //   ? 0
                //   //   : showInputInUSD
                //   //   ? formatInputUSD()
                //   //   : inputValue
                // }
                onChange={value => handleInput(value)}
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
            symbol={'oSOULC'}
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
                    _hover={{ cursor: 'pointer' }}
                    // onClick={() =>
                    //   setShowInputInUSD && setShowInputInUSD(!showInputInUSD)
                    // }
                  >
                    {getBalanceValue()}
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
                // cursor={showCursorPointer()}
                // onClick={() => handleInput(balance)}
              >
                {'Balance: ' + 0}
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
          onChange={value => handleInput(value.value)}
          decimals={18}
          symbol={'SOULC'}
          balance={'0'}
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
                onChange={value => handleInput(value)}
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
            symbol={'WCANTO'}
            src={resolveRoutePath(`images/tokens/WCANTO.png`)}
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
                    _hover={{ cursor: 'pointer' }}
                    // onClick={() =>
                    //   setShowInputInUSD && setShowInputInUSD(!showInputInUSD)
                    // }
                  >
                    {getBalanceValue()}
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
                // cursor={showCursorPointer()}
                // onClick={() => handleInput(balance)}
              >
                {'Balance: ' + 0}
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
          onChange={value => handleInput(value.value)}
          decimals={18}
          symbol={'SOULC'}
          balance={'0'}
        />

        {/* {children} */}
      </Flex>

      <Flex>
        <p>You will recieve </p>
        <Spacer />
        <p> {0} WCANTO </p>
      </Flex>
      <Flex>
        <Spacer />
        <Text as="div" fontSize="h5" color="grayDarker" mr="spacing02">
          <Flex align="center" justify="center" sx={{ gap: '0.2rem' }}>
            <Text
              _hover={{ cursor: 'pointer' }}
              // onClick={() =>
              //   setShowInputInUSD && setShowInputInUSD(!showInputInUSD)
              // }
            >
              {getBalanceValue()}
            </Text>
          </Flex>
        </Text>
      </Flex>

      <Button size="lg" mt="16px" w="full" onClick={buttonAction}>
        Redeem
      </Button>
    </Box>
  );
}
