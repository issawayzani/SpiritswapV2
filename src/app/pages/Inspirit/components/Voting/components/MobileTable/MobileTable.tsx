import { Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { MobileTableProps } from './MobileTable.d';
import { MobileRow } from '../MobileRow';
import { QuestionHelper } from 'app/components/QuestionHelper';

const MobileTable: FC<MobileTableProps> = ({
  labelData,
  filteredBribes,
  resetInputs,
  onNewVote,
  cleanError,
}) => {
  const [direction, setDirection] = useState('des');

  const handleOnSort = (by, onSort) => {
    onSort(by, direction);
    setDirection(prevDir => (prevDir === 'des' ? 'asc' : 'des'));
  };

  return (
    <HStack w="full" p="8px" alignItems="start">
      <Grid templateColumns="repeat(1, 90px)" gap={2}>
        {labelData.map(labelItem => {
          const isLiquidityPer10kInspirit = labelItem.id === 4;
          const isRewardsPer10kInspirit = labelItem.id === 3;
          return (
            <GridItem
              display="flex"
              key={`${labelItem.label}-label`}
              w="full"
              h={[1].includes(labelItem.id) ? '60px' : '50px'}
            >
              <Text
                display="flex"
                alignItems="center"
                fontWeight="medium"
                h="full"
                fontSize="xs"
                onClick={() =>
                  handleOnSort(labelItem.sortYpe, labelItem.onSort)
                }
              >
                {labelItem.label}
              </Text>
              {isLiquidityPer10kInspirit || isRewardsPer10kInspirit ? (
                <QuestionHelper
                  title={
                    isRewardsPer10kInspirit
                      ? 'Rewards / 10k inSPIRIT'
                      : 'Liquidity / 10k inSPIRIT'
                  }
                  text={
                    isRewardsPer10kInspirit
                      ? 'Amount of rewards earned per 10k inSPIRIT voted'
                      : ' Amount of liquidity equivalent held per 10k inSPIRIT voted'
                  }
                />
              ) : null}
            </GridItem>
          );
        })}
      </Grid>
      <HStack overflow="scroll">
        {filteredBribes.length
          ? filteredBribes.map(
              (farm, i) =>
                farm.isAlive && (
                  <MobileRow
                    farm={farm}
                    key={`farm-${farm.symbol}-${i}`}
                    resetInputs={resetInputs}
                    onNewVote={onNewVote}
                    cleanError={cleanError}
                  />
                ),
            )
          : null}
      </HStack>
    </HStack>
  );
};

export default MobileTable;
