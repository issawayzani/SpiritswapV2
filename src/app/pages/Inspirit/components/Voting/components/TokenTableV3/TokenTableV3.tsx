import {
  Button,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Text,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
// import { getUserFarms } from 'app/utils';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import {
  selectFarmsStaked,
  selectLiquidityWallet,
  selectLockedInSpiritAmount,
} from 'store/user/selectors';
import FarmsData from './FarmsData';
import HeaderTable from './HeaderTable';
import ToggleFilter from './ToggleFilter';
import { StyledHighlightMessage } from '../../styles';
import { useTranslation } from 'react-i18next';
import LabelTable from './LabelTable';
import sortFn from '../TokensTable/sortUtils';
import { selectSaturatedGauges } from 'store/general/selectors';
import useMobile from 'utils/isMobile';
import { MobileTable } from '../MobileTable';
import useWallets from 'app/hooks/useWallets';
import { checkLastVoted, getBribeCards } from 'utils/web3/actions/inspirit';
import { colors } from 'theme/base/color';
import { borderRadius } from 'theme/base/borderRadius';
const TokenTableV3 = ({
  errorMessage,
  handleVote,
  setErrorMessage,
  isLoading,
  selectedFarm,
  farmsSize,
  handleSort,
  userOnly,
  toggleUserFarm,
  cleanError,
}) => {
  const { t } = useTranslation();
  const { account, isLoggedIn } = useWallets();
  const isMobile = useMobile();
  const translationPath = 'inSpirit.voting';
  const [bribeCards, setBribeCards] = useState([]);
  // const stakedFarms = useAppSelector(selectFarmsStaked);
  // const lockedSpiritBalance = useAppSelector(selectLockedInSpiritAmount);
  const [searchValues, setSearchValues] = useState('');
  const [showMobileTableFilters, setShowMobileTableFilters] =
    useState<boolean>(false);
  const [newVotes, setNewVotes] = useState({});
  // const onFarmSearch = e => {
  //   const query = e.target.value;
  //   setSearchValues(query);
  // };

  const { boostedV2, boostedStable } = useAppSelector(selectSaturatedGauges);

  const toggleMobileTableFilters = () => {
    setShowMobileTableFilters(!showMobileTableFilters);
  };

  const onNewVote = (value: string, lpAddress: string) => {
    setNewVotes({ ...newVotes, [lpAddress]: value });
    setResetInputs(false);
  };

  useEffect(() => {
    const fetch = async () => {
      const data = await getBribeCards(account);
      setBribeCards(data);
    };
    fetch();
    // const getBoostedFarms = async () => {
    //   const userBoostedV2 = getUserFarms(boostedV2, stakedFarms);
    //   const userBoostedStable = getUserFarms(boostedStable, stakedFarms);

    //   onUpdateFarm({
    //     v2Classics: sortFn(boostedV2, 'yourVote', 'des'),
    //     userv2Classics: sortFn(userBoostedV2, 'yourVote', 'des'),
    //     stables: sortFn(boostedStable, 'yourVote', 'des'),
    //     userStables: sortFn(userBoostedStable, 'yourVote', 'des'),
    //   });
    // };
    // getBoostedFarms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userOnly, account, boostedV2, boostedStable]);

  const filteredBribes = useMemo(() => {
    if (searchValues) {
      const newList = selectedFarm.filter(farm => {
        const [tokenA, tokenB] = farm.name.split(' ');
        const lowerSearch = searchValues.toLowerCase();
        const lowertokenA = tokenA.toLowerCase();
        const lowertokenB = tokenB.toLowerCase();

        const isIncluded =
          lowertokenA.includes(lowerSearch) ||
          lowertokenB.includes(lowerSearch);
        if (isIncluded) return true;
        return false;
      });
      return newList;
    }
    return bribeCards;
  }, [bribeCards]);

  const [resetInputs, setResetInputs] = useState<boolean>(false);

  const resetVoting = async () => {
    const canReset = await checkLastVoted(account);
    if (!canReset) {
      setErrorMessage('You can only reset once per epoch');
    } else {
      setResetInputs(true);
      setNewVotes({});
    }
  };

  const labelData = [
    {
      id: 1,
      label: isMobile ? `${farmsSize} Farms` : 'Farm',
      sortYpe: 'globalVoting',
      onSort: handleSort,
    },
    { id: 2, label: 'Votes', sortYpe: 'globalVoting', onSort: handleSort },
    {
      id: 3,
      label: 'Earned',
      sortYpe: 'userRewards',
      onSort: handleSort,
    },
    {
      id: 4,
      label: 'Rewards/Vote',
      sortYpe: 'rewards',
      onSort: handleSort,
    },

    { id: 5, label: 'Your vote (%)', sortYpe: 'yourVote', onSort: handleSort },
  ];

  return (
    <VStack w="full" marginTop={'50px'}>
      {/* <HeaderTable
        onFarmSearch={onFarmSearch}
        toggleMobileTableFilters={toggleMobileTableFilters}
        toggleUserFarm={toggleUserFarm}
        userFarmsOnly={userOnly}
        farmsSize={farmsSize}
      /> */}
      {showMobileTableFilters && (
        <ToggleFilter toggleFarms={toggleUserFarm} userFarmsOnly={userOnly} />
      )}

      {isMobile ? (
        <MobileTable
          labelData={labelData}
          filteredBribes={filteredBribes}
          resetInputs={resetInputs}
          onNewVote={onNewVote}
          cleanError={cleanError}
        />
      ) : (
        <TableContainer w="full">
          <Table variant="inspirit">
            <Thead>
              <Tr>
                {labelData.map((label, i) => (
                  <LabelTable
                    id={label.id}
                    label={label.label}
                    sortType={label.sortYpe}
                    onSort={label.onSort}
                    key={label.label}
                    isLast={labelData.length === ++i}
                    isFirst={label.id === 1}
                  />
                ))}
              </Tr>
            </Thead>
            <Tbody w="full">
              {filteredBribes.length
                ? filteredBribes.map(
                    (farm, i) =>
                      farm.isAlive && (
                        <FarmsData
                          farm={farm}
                          key={`farm-${farm.symbol}-${i}`}
                          resetVoting={resetInputs}
                          onNewVote={onNewVote}
                          cleanError={cleanError}
                        />
                      ),
                  )
                : null}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {errorMessage && (
        <Text color="red.500" mb="spacing03">
          {t(errorMessage)}
        </Text>
      )}
      <HStack w="full" justify={isMobile ? 'center' : 'flex-end'} p="8px">
        <Button
          bg={colors.bgReset}
          disabled={!isLoggedIn}
          border="none"
          className="button-padding reset-button"
          borderRadius={borderRadius.mmd}
          w={isMobile ? 'full' : '-moz-initial'}
          onClick={resetVoting}
        >
          {t(`${translationPath}.resetVoting`)}
        </Button>
        <Button
          className="green-button button-padding"
          bg="transparent"
          borderRadius={borderRadius.mmd}
          variant="primary"
          w={isMobile ? 'full' : '-moz-initial'}
          isLoading={isLoading}
          onClick={() => handleVote(filteredBribes, newVotes)}
        >
          {t(
            `${translationPath}.${isLoggedIn ? 'confirmVote' : 'notconnected'}`,
          )}
        </Button>
      </HStack>
    </VStack>
  );
};

export default TokenTableV3;
