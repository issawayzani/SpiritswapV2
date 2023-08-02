import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Heading } from 'app/components/Typography';
import { StyledVoting, StyledPanel } from '../../styles';
import { Select } from 'app/components/Select';
import '../../../../../styles.css';
import {
  checkLastVoted,
  checkLastVotes,
  claimBribes,
  getBribeCards,
  getVotePageData,
  transactionResponse,
  vote,
} from 'utils/web3/actions';
import {
  Button,
  Flex,
  HStack,
  Skeleton,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { StyledHeader, StyledHeaderParagraph } from './styles';
import { CardHeader } from 'app/components/CardHeader';
import { VOTING } from 'constants/icons';
import { ERROR_MUST_SUM_100 } from 'constants/errors';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { VotingPanel } from './components/VotingPanel';
import { BribeCard } from 'app/interfaces/Inspirit';
import { PlusIcon } from 'app/assets/icons';
import useWallets from 'app/hooks/useWallets';
import useMobile from 'utils/isMobile';
import styles from './Button.module.css';
import usePieChartData from 'app/hooks/usePieChartData';
import { PieChart } from './components/PieChart';

function Voting() {
  const { t } = useTranslation();
  const [loaderText, setLoaderText] = useState('Loading');
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [bribeCards, setBribeCards] = useState<BribeCard[]>([]);
  const [accountVTOKEN, setAccountVTOKEN] = useState('');
  const [accountVotingPower, SetAccountVotingPower] = useState('');
  const { account } = useWallets();
  const { addToQueue } = Web3Monitoring();
  const [errorMessage, setErrorMessage] = useState('');
  const { isLoading, loadingOff, loadingOn } = UseIsLoading();
  const newBribeDisclosure = useDisclosure();
  const isMobile = useMobile('1076px');

  const cleanErrorMessage = () => {
    if (errorMessage) {
      setErrorMessage('');
    }
  };
  const getDisabledStatus = (): boolean => {
    const DISABLED = true;
    const NOT_DISABLED = false;
    if (isLoadingButton) return DISABLED;

    return NOT_DISABLED;
  };
  const onCreateBribe = () => {
    newBribeDisclosure.onOpen();
  };

  useEffect(() => {
    const fetch = async () => {
      const data = await getBribeCards(account);
      setBribeCards(data);
      const userData = await getVotePageData(account);
      setAccountVTOKEN((userData.accountVTOKEN / 1e18).toString());
      SetAccountVotingPower((userData.accounVotingPower / 1e18).toString());
    };
    fetch();
  }, [account]);

  const claimReward = async bribeAddresses => {
    setIsLoadingButton(true);
    const bribes: any = [];
    for (let i = 0; i < bribeAddresses.length; i++) {
      const vault = bribeAddresses[i];
      const accountPercent = Number(vault.accountVotePercent);
      if (accountPercent > 0) {
        bribes.push(vault.bribe);
      }
    }
    try {
      setLoaderText('Claiming');
      console.log(bribes);
      const tx = await claimBribes(bribes);
      const response = transactionResponse('vote.claim', {
        operation: 'VOTE',
        tx: tx,
        uniqueMessage: {
          text: 'Claim rewards',
          secondText: '',
        },
      });

      addToQueue(response);
      await tx.wait();
      setIsLoadingButton(false);
    } catch {
      setIsLoadingButton(false);
    }
  };

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const nextThursday = new Date();

      // Find the next Thursday
      const daysUntilNextThursday = (11 - now.getDay() + 7) % 7;
      nextThursday.setDate(now.getDate() + daysUntilNextThursday);
      nextThursday.setUTCHours(0, 0, 0, 0);

      const timeDifference = nextThursday.getTime() - now.getTime();

      // Check if current time is after the target Thursday
      if (timeDifference < 0) {
        // Add 7 days to find the next Thursday
        nextThursday.setDate(nextThursday.getDate() + 7);
        const newTimeDifference = nextThursday.getTime() - now.getTime();

        // Calculate days, hours, and minutes remaining
        const daysRemaining = Math.ceil(
          newTimeDifference / (1000 * 60 * 60 * 24),
        ); // Use Math.ceil instead of Math.floor
        const hoursRemaining = Math.floor(
          (newTimeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutesRemaining = Math.floor(
          (newTimeDifference % (1000 * 60 * 60)) / (1000 * 60),
        );

        // Format the time remaining string
        const formattedTimeRemaining = `${daysRemaining}d ${hoursRemaining}h ${minutesRemaining}m`;

        setTimeRemaining(formattedTimeRemaining);
      } else {
        // Calculate days, hours, and minutes remaining
        const daysRemaining = Math.floor(
          timeDifference / (1000 * 60 * 60 * 24),
        );
        const hoursRemaining = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutesRemaining = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
        );

        // Format the time remaining string
        const formattedTimeRemaining = `${daysRemaining}d ${hoursRemaining}h ${minutesRemaining}m`;

        setTimeRemaining(formattedTimeRemaining);
      }
    };

    // Update the time remaining every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);
  const handleVote = async (tableData: BribeCard[], newVotes) => {
    let votingWeight = 0;
    const plugins: any = [];
    const weights: any = [];
    const canVote = await checkLastVoted(account);
    console.log(canVote);
    if (!canVote) {
      setErrorMessage('You can only vote once per epoch');
      return;
    }
    for (let i = 0; i < tableData.length; i++) {
      const vault = tableData[i];
      const address = vault.plugin;
      if (newVotes[address]) {
        const weight = parseFloat(`${newVotes[address]}`);
        if (weight && address) {
          votingWeight += weight;
          plugins.push(address);
          weights.push(weight);
        }
      }
    }

    if (votingWeight !== 100) {
      setErrorMessage(ERROR_MUST_SUM_100);
    } else if (votingWeight === 100 && canVote) {
      try {
        loadingOn();
        const response = await vote(plugins, weights);
        await response.tx.wait();
        loadingOff();
        addToQueue(response);
      } catch (e) {
        console.log(e);
        loadingOff();
      }
    }
  };

  // const onChangeFarmType = selected => {
  //   setSelectedFarmType(selected);
  //   setIsStableData(!isStableData);
  // };
  const { pieChartData, pieChartOptions } = usePieChartData({
    farmsList: bribeCards,
  });
  return (
    <StyledVoting gridArea="Voting" id="voting_section" isMobile={isMobile}>
      <StyledPanel>
        <StyledHeader>
          <Flex direction="column" w="100%">
            <HStack w={'100%'} justifyContent={'space-between'}>
              <Flex sx={{ gap: '0.3rem', flexDirection: 'column' }}>
                <div style={{ marginBottom: 10 }}>
                  <div className="swap-title">
                    Converge<span className="swap-x">X </span>Voting
                  </div>
                </div>
                <div>
                  <div className="time-vote">Time Until Next Vote:</div>
                  <div className="purple-time">{timeRemaining}</div>
                </div>
                <Button className="bribe-button" onClick={onCreateBribe}>
                  <Text>New Bribe</Text>
                </Button>
              </Flex>

              <Flex justifyContent="center">
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
              </Flex>

              <Flex direction="column">
                <Flex direction="row">
                  <Text> VTOKEN Balance</Text>
                  <Spacer />
                  <Text textAlign="right">{accountVTOKEN}</Text>
                </Flex>
                <Flex marginTop="20px" direction="row">
                  <Text> Voting Power: </Text>
                  <Spacer />
                  <Text textAlign="right">{accountVotingPower}</Text>
                </Flex>

                <Button
                  className="green-claim"
                  onClick={() => claimReward(bribeCards)}
                  loadingText={loaderText}
                  isLoading={isLoadingButton}
                  disabled={getDisabledStatus()}
                >
                  <Text>Claim Voting Rewards</Text>
                </Button>
              </Flex>
            </HStack>
          </Flex>
        </StyledHeader>

        <VotingPanel
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          handleVote={handleVote}
          isLoading={isLoading}
          cleanError={cleanErrorMessage}
          newBribeDisclosure={newBribeDisclosure}
        />
      </StyledPanel>
    </StyledVoting>
  );
}

export default Voting;
