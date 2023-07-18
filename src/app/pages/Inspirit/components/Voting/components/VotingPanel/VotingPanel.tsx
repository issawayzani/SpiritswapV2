import { Flex, Skeleton } from '@chakra-ui/react';
import usePieChartData from 'app/hooks/usePieChartData';
import useWallets from 'app/hooks/useWallets';
import { BribeCard } from 'app/interfaces/Inspirit';
import { useEffect, useState } from 'react';
import { selectFarmMasterData } from 'store/farms/selectors';
import { useAppSelector } from 'store/hooks';
import { getBribeCards } from 'utils/web3';
import { NewBribeModal } from '../../../Bribes/NewBribeModal';
import { PieChart } from '../PieChart';
import sortFn from '../TokensTable/sortUtils';
import { TokenTableV3 } from '../TokenTableV3';

interface VotingFarms {
  farms: BribeCard[];
  userFarms: BribeCard[];
}

const VotingPanel = ({
  handleVote,
  setErrorMessage,
  errorMessage,
  isLoading,
  cleanError,
  newBribeDisclosure,
}) => {
  const { account, isLoggedIn } = useWallets();
  const [bribeCards, setBribeCards] = useState<BribeCard[]>([]);
  const [userOnly, setUserOnly] = useState(false);
  // const [classicFarms, setclassicFarms] = useState<VotingFarms>({
  //   farms: [],
  //   userFarms: [],
  // });
  // const [stableFarms, setStableFarms] = useState<VotingFarms>({
  //   farms: [],
  //   userFarms: [],
  // });

  // const [v2Farms, setV2Farms] = useState<VotingFarms>({
  //   farms: [],
  //   userFarms: [],
  // });

  const [selectedFarms, setSelectedFarms] = useState<BribeCard[]>([]);
  const [sortBy, setSortBy] = useState();
  const [sortDirection, setSortDirection] = useState();

  const toggleUserFarm = () => {
    setUserOnly(!userOnly);
  };

  // const updatingFarm = ({
  //   classics,
  //   userClassics,
  //   stables,
  //   userStables,
  //   v2Classics,
  //   userv2Classics,
  // }) => {
  //   setclassicFarms({ farms: classics, userFarms: userClassics });
  //   setV2Farms({ farms: v2Classics, userFarms: userv2Classics });
  //   setStableFarms({ farms: stables, userFarms: userStables });
  // };

  const handleSort = (by, direction) => {
    // to do
    // setBribeCards(sortFn(finalSelectedFarms, by, direction));
    // setSortBy(by);
    // setSortDirection(direction);
  };
  useEffect(() => {
    const fetch = async () => {
      const data = await getBribeCards(account);
      setBribeCards(data);
    };
    fetch();
  }, [account]);
  // useEffect(() => {
  //   if (farmType.index === 0) {
  //     setSelectedFarms(
  //       sortFn(
  //         userOnly ? stableFarms.userFarms : stableFarms.farms,
  //         sortBy,
  //         sortDirection,
  //       ),
  //     );
  //   }
  //   if (farmType.index === 1) {
  //     setSelectedFarms(
  //       sortFn(
  //         userOnly ? v2Farms.userFarms : v2Farms.farms,
  //         sortBy,
  //         sortDirection,
  //       ),
  //     );
  //   }
  // }, [farmType, userOnly, classicFarms, stableFarms, v2Farms]);

  const farmsSize = bribeCards?.length;

  const allFarms = useAppSelector(selectFarmMasterData);

  const finalSelectedFarms: BribeCard[] = selectedFarms.map(listFarm => {
    const find = allFarms.find(
      farmInAllFarmList => farmInAllFarmList.lpAddress === listFarm.plugin,
    );
    // if (find) {
    //   const poolLiquidity = find.totalLiquidity || 0;

    //   const liquidityPer10kInspirit: number =
    //     (poolLiquidity / (listFarm.voteWeight * 10000));

    //   return { ...listFarm, liquidityPer10kInspirit };
    // }
    return { ...listFarm };
  });

  const { pieChartData, pieChartOptions } = usePieChartData({
    farmsList: bribeCards,
  });

  return (
    <>
      {/* <Flex justifyContent="center">
        <Skeleton
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          h="240px"
          w="240px"
          borderRadius="50%"
          isLoaded={!!bribeCards.length}
        >
          <PieChart data={pieChartData} options={pieChartOptions} />
        </Skeleton>
      </Flex> */}

      <TokenTableV3
        errorMessage={errorMessage}
        handleVote={handleVote}
        isLoading={isLoading}
        // onUpdateFarm={updatingFarm}
        setErrorMessage={setErrorMessage}
        selectedFarm={finalSelectedFarms}
        farmsSize={farmsSize}
        handleSort={handleSort}
        userOnly={userOnly}
        toggleUserFarm={toggleUserFarm}
        cleanError={cleanError}
      />

      {newBribeDisclosure.isOpen ? (
        <NewBribeModal
          farms={bribeCards.filter(card => card.isAlive)}
          {...newBribeDisclosure}
        />
      ) : null}
    </>
  );
};

export default VotingPanel;
