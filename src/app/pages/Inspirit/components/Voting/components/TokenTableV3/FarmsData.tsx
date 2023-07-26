import { HStack, Td, Text, Tr } from '@chakra-ui/react';
import ImageLogo from 'app/components/ImageLogo';
import { VotingInput } from '../VotingInput';
import { convertAmount, formatNumber } from 'app/utils';
import { Fragment, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { selectSpiritInfo } from 'store/general/selectors';
import { useAppSelector } from 'store/hooks';
import { BribeCard } from 'app/interfaces/Inspirit';
import { getTokenSymbol } from 'utils/web3';
import { parseUnits } from 'ethers/lib/utils';

type TokenInfo = {
  name: string;
  reward: number;
};
const FarmsData = ({
  farm,
  onNewVote,
  resetVoting,
  cleanError,
}: {
  farm: BribeCard;
  onNewVote: (value: string, lpAddress: string) => void;
  resetVoting: boolean;
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
  const [tokenInfo, setTokenInfo] = useState<TokenInfo[]>([]);
  const [tokenAccountInfo, setTokenAccountInfo] = useState<TokenInfo[]>([]);
  const votePercentage = (Number(votePercent) / 1e18).toFixed(2);
  const newVoteWeight = (Number(voteWeight) / 1e18).toFixed(1);
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

  // const tokenInfos = async () => {
  //  return await Promise.all(tokenInfo);
  // }
  // const lpAddress = fulldata?.farmAddress || '';
  // const [tokenA, tokenB] = name.split(' ');
  // const { price: spiritPrice } = useAppSelector(selectSpiritInfo);

  // const calculateAPR = _value => {
  //   const value = new BigNumber(_value);
  //   const aprValue = new BigNumber(spiritPrice).multipliedBy(10000);
  //   return value
  //     .multipliedBy(52)
  //     .dividedBy(aprValue)
  //     .multipliedBy(100)
  //     .toNumber();
  // };

  // const { rewardAPR } = useMemo(() => {
  //   if (bribes && spiritPrice) {
  //     const rewardAPR = calculateAPR(bribes);
  //     return { rewardAPR };
  //   }
  //   return { rewardAPR: 0 };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [bribes]);

  return (
    <Tr style={{ backgroundColor: 'transparent' }}>
      <Td>
        <HStack mt="8px">
          <Text color="#A19ED3">{protocol}</Text>
        </HStack>
        <HStack spacing={0}>
          <ImageLogo margin="0" symbol="ftm" size="24px" />
          <ImageLogo margin="0" symbol="ftm" size="24px" />
          <Text color="#93BDFF">{symbol}</Text>
        </HStack>
      </Td>
      <Td>
        <HStack justify="center">
          <Text fontSize="sm">{`${votePercentage}%`}</Text>
        </HStack>
        <HStack justify="center">
          <Text color="grayDarker" fontSize="sm">
            {newVoteWeight} M
          </Text>
        </HStack>
      </Td>
      {/* <Td>
        <Text fontSize="sm">{`${rewardAPR.toFixed(2)}%`}</Text>
      </Td> */}
      {/* <Td>
        <Text fontSize="sm">{`$${formatNumber({
          value: Number(bribes),
        })}`}</Text>
      </Td> */}
      <Td>
        {tokenAccountInfo?.map((token, index) => (
          <Text fontSize="sm" key={index}>
            <>
              {token.name} {token.reward}
            </>
          </Text>
        ))}
      </Td>

      <Td>
        {tokenInfo?.map((token, index) => (
          <Text fontSize="sm" key={index}>
            <>
              {token.name} {token.reward}
            </>
          </Text>
        ))}
      </Td>

      <Td>
        <VotingInput
          yourVote={Number(accountVotePercent) / 1e18}
          onNewVote={onNewVote}
          lpAddress={plugin}
          cleanError={cleanError}
          resetVoting={resetVoting}
        />
      </Td>
    </Tr>
  );
};

export default FarmsData;
