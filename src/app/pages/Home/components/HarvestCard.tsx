import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { SwapContainer } from '../portfolioStyles';
import './styles.css';
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
  const [loaderText, setLoaderText] = useState('Loading Transaction');
  const OTOKENPrice =
    (props.bondingCurveData?.priceOTOKEN *
      props.bondingCurveData?.accountOTOKEN) /
    1e18;
  const OTOKENRewards = props.bondingCurveData?.accountEarnedOTOKEN / 1e18;
  const TOKENPrice =
    (props.bondingCurveData?.priceTOKEN *
      props.bondingCurveData?.accountTOKEN) /
    1e18;
  const TOKENRewards = props.bondingCurveData?.accountEarnedTOKEN / 1e18;
  const BASEPrice =
    (props.bondingCurveData?.priceBASE * props.bondingCurveData?.accountBASE) /
    1e18;
  const BASERewards = props.bondingCurveData?.accountEarnedBASE / 1e18;
  const VTOKENPrice =
    (props.bondingCurveData?.priceTOKEN *
      props.bondingCurveData?.accountVTOKEN) /
    1e18;
  const creditPrice =
    (props.bondingCurveData?.priceBASE *
      props.bondingCurveData?.accountBorrowCredit) /
    1e18;
  const debtPrice =
    (props.bondingCurveData?.priceBASE *
      props.bondingCurveData?.accountBorrowCredit) /
    1e18;
  const buttonAction = async () => {
    setIsLoadingButton(true);
    // if (OTOKENRewards===0 && TOKENRewards===0 && BASERewards===0 ){

    // }else {
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
          rewards={OTOKENRewards}
          value={props.bondingCurveData?.accountOTOKEN / 1e18}
          valueUSD={OTOKENPrice}
          check={true}
        />

        <StatisticsPanel
          icon={Glov3}
          name="GLOV3"
          value={props.bondingCurveData?.accountBorrowCredit / 1e18}
          valueUSD={creditPrice}
          check={false}
        />

        <StatisticsPanel
          icon={Wftm}
          name="WFTM"
          value={props.bondingCurveData?.accountBorrowDebt / 1e18}
          valueUSD={debtPrice}
          check={false}
        />

        <Button
          size="lg"
          mt="16px"
          w="full"
          className="default-button"
          onClick={buttonAction}
          isLoading={isLoadingButton}
          loadingText={loaderText}
        >
          Harvest All
        </Button>
      </SwapContainer>
    </Box>
  );
}
