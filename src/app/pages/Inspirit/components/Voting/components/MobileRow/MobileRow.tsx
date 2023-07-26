import { Grid, GridItem, HStack, Text, VStack } from '@chakra-ui/react';
import ImageLogo from 'app/components/ImageLogo';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { BribeCard } from 'app/interfaces/Inspirit';
import { convertAmount, formatNumber } from 'app/utils';
import BigNumber from 'bignumber.js';
import { parseUnits } from 'ethers/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { selectSpiritInfo } from 'store/general/selectors';
import { useAppSelector } from 'store/hooks';
import { getTokenSymbol } from 'utils/web3';
import { VotingInput } from '../VotingInput';
type TokenInfo = {
  name: string;
  reward: number;
};
const MobileRow = ({
  farm,
  resetInputs,
  onNewVote,
  cleanError,
}: {
  farm;
  onNewVote: (value: string, lpAddress: string) => void;
  resetInputs: boolean;
  cleanError: () => void;
}) => {
  const {
    plugin,
    isAlive,
    protocol,
    symbol,
    rewardTokens,
    rewardTokenDecimals,
    rewardsPerToken,
    accountRewardsEarned,
    voteWeight,
    votePercent,
    accountVotePercent,
  } = farm;
  const votePercentage = (Number(votePercent) / 1e18).toFixed(2);
  const newVoteWeight = (Number(voteWeight) / 1e18).toFixed(1);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo[]>([]);
  const [tokenAccountInfo, setTokenAccountInfo] = useState<TokenInfo[]>([]);
  const height = '50px';
  const heightBG = '60px';
  const calculateRewards = async () => {
    const tokenInfoPromises = rewardTokens.map(async (token, index) => {
      const name = await getTokenSymbol(token);
      const decimal = rewardTokenDecimals[index];
      const divisor = Math.pow(10, decimal);
      const reward = Number(rewardsPerToken[index]) / divisor;
      if (name) {
        return { name, reward };
      }
    });
    const tokenInfoAccountPromises = rewardTokens.map(async (token, index) => {
      const name = await getTokenSymbol(token);
      const decimal = rewardTokenDecimals[index];
      const divisor = Math.pow(10, decimal);
      const reward = Number(accountRewardsEarned[index]) / divisor;
      if (name) {
        return { name, reward };
      }
    });

    const tokenInfos = await Promise.all(tokenInfoPromises);
    const tokenAccountInfos = await Promise.all(tokenInfoAccountPromises);
    if (tokenInfos) {
      const filteredTokenInfo = tokenInfos.filter(
        (token): token is TokenInfo => token !== undefined,
      );
      setTokenInfo(filteredTokenInfo);
    }
    if (tokenAccountInfos) {
      const filteredTokenInfo = tokenAccountInfos.filter(
        (token): token is TokenInfo => token !== undefined,
      );
      setTokenAccountInfo(filteredTokenInfo);
    }
  };
  useEffect(() => {
    const fetch = async () => {
      await calculateRewards();
    };
    fetch();
  }, []);

  return (
    <Grid templateColumns="repeat(1, 1fr)" gap={2}>
      <GridItem
        w="184px"
        h={heightBG}
        bg="bgBoxLighter"
        borderRadius="md"
        display="flex"
        alignItems="center"
        p="8px"
      >
        <VStack spacing={0}>
          <HStack spacing={0} justify="flex-start" w="full">
            <Text fontWeight="medium" fontSize="sm">
              {protocol}
            </Text>
          </HStack>
          <HStack spacing={0}>
            <ImageLogo margin="0" symbol="ftm" size="24px" />
            <ImageLogo symbol="ftm" size="24px" />
            <Text fontWeight="medium" fontSize="sm">
              {symbol}
            </Text>
          </HStack>
        </VStack>
      </GridItem>
      <GridItem
        w="184px"
        h={height}
        bg="bgBoxLighter"
        borderRadius="md"
        display="flex"
        alignItems="center"
        p="8px"
      >
        <HStack>
          <Text fontSize="sm">{`${votePercentage}%`}</Text>
          <Text color="grayDarker" fontSize="sm">
            {newVoteWeight} M
          </Text>
        </HStack>
      </GridItem>
      {/* <GridItem
        w="184px"
        h={height}
        bg="bgBoxLighter"
        borderRadius="md"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        flexDirection="column"
        p="8px"
      >
        <Text fontSize="sm">{`${rewardAPR.toFixed(2)}%`}</Text>
      </GridItem> */}
      <GridItem
        w="184px"
        h={height}
        bg="bgBoxLighter"
        borderRadius="md"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        flexDirection="column"
        p="8px"
      >
        {tokenAccountInfo?.map((token, index) => (
          <Text fontSize="sm" key={index}>
            <>
              {token.name}
              {token.reward}
            </>
          </Text>
        ))}
      </GridItem>
      <GridItem
        w="184px"
        h={height}
        bg="bgBoxLighter"
        borderRadius="md"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        flexDirection="column"
        p="8px"
      >
        {tokenAccountInfo?.map((token, index) => (
          <Text fontSize="sm" key={index}>
            {token.name}

            {token.reward}
          </Text>
        ))}
      </GridItem>
      {/* <GridItem
        w="184px"
        h={height}
        bg="bgBoxLighter"
        borderRadius="md"
        display="flex"
        alignItems="center"
        p="8px"
      >
        <Text fontSize="sm">{`$${formatNumber({
          value: Number(feeEarns),
        })}`}</Text>
      </GridItem> */}

      <GridItem w="184px" h={heightBG}>
        <VotingInput
          yourVote={Number(accountVotePercent) / 1e18}
          onNewVote={onNewVote}
          lpAddress={plugin}
          cleanError={cleanError}
          resetVoting={resetInputs}
        />
      </GridItem>
    </Grid>
  );
};

export default MobileRow;
