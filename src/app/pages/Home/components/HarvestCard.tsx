import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { SwapContainer } from '../portfolioStyles';
import '../../../../styles.css';
import { StatisticsPanel } from './Panels';
import { getReward } from 'utils/web3/actions/inspirit';
import { transactionResponse } from 'utils/web3';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { useState } from 'react';
import Pow3r from '../../../assets/images/pow3r.svg';
import Glov3 from '../../../assets/images/glov3.svg';
import Wftm from '../../../assets/images/fantom-logo.svg';

export default function HarvestCard(props) {
  const { addToQueue } = Web3Monitoring();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [loaderText, setLoaderText] = useState('Harvesting');

  const OTOKENRewards = props.bondingCurveData?.accountEarnedOTOKEN / 1e18;
  const OTOKENPrice =
    (props.bondingCurveData?.priceOTOKEN *
      props.bondingCurveData?.accountEarnedOTOKEN) /
    1e36;
  const TOKENRewards = props.bondingCurveData?.accountEarnedTOKEN / 1e18;
  const TOKENPrice =
    (props.bondingCurveData?.priceTOKEN *
      props.bondingCurveData?.accountEarnedTOKEN) /
    1e36;
  const BASERewards = props.bondingCurveData?.accountEarnedBASE / 1e18;
  const BASEPrice =
    (props.bondingCurveData?.priceBASE *
      props.bondingCurveData?.accountEarnedBASE) /
    1e36;

  const getDisabledStatus = (): boolean => {
    const DISABLED = true;
    const NOT_DISABLED = false;
    if (props.check) return DISABLED;
    if (isLoadingButton) return DISABLED;
    if (BASERewards === 0 && TOKENRewards === 0 && OTOKENRewards === 0)
      return DISABLED;
    return NOT_DISABLED;
  };
  const buttonAction = async () => {
    setIsLoadingButton(true);
    try {
      const tx = await getReward(props?.account);
      const response = transactionResponse('swap.claim', {
        operation: 'SWAP',
        tx: tx,
        uniqueMessage: {
          text: 'Claiming',
          secondText: 'Rewards',
        },
      });

      addToQueue(response);
      await tx.wait();
      setIsLoadingButton(false);
    } catch (e) {
      setIsLoadingButton(false);
    }
  };
  return (
    <Box>
      <SwapContainer>
        <StatisticsPanel
          icon={Pow3r}
          name="POW3R"
          value={OTOKENRewards}
          valueUSD={OTOKENPrice}
          check={props.check}
        />

        <StatisticsPanel
          icon={Glov3}
          name="GLOV3"
          value={TOKENRewards}
          valueUSD={TOKENPrice}
          check={props.check}
        />

        <StatisticsPanel
          icon={Wftm}
          name="WFTM"
          value={BASERewards}
          valueUSD={BASEPrice}
          check={props.check}
        />

        <Button
          size="lg"
          mt="16px"
          w="full"
          className="default-button"
          onClick={buttonAction}
          disabled={getDisabledStatus()}
          isLoading={isLoadingButton}
          loadingText={loaderText}
        >
          Harvest All
        </Button>
      </SwapContainer>
    </Box>
  );
}
