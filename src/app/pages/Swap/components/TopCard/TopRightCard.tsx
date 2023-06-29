import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { SwapContainer } from '../../styles';
import './styles.css';
import { StatisticsPanel } from '../Panels';
import { getReward } from 'utils/web3/actions/inspirit';
import { transactionResponse } from 'utils/web3';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { useState } from 'react';

export default function TopRightCard(props) {
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
    <Box mb="10px">
      <SwapContainer>
        <StatisticsPanel
          name="oSOUL"
          rewards={OTOKENRewards}
          value={props.bondingCurveData?.accountOTOKEN / 1e18}
          valueUSD={OTOKENPrice}
          check={true}
        />

        <StatisticsPanel
          name="SOUL"
          rewards={TOKENRewards}
          value={props.bondingCurveData?.accountTOKEN / 1e18}
          valueUSD={TOKENPrice}
          check={true}
        />
        <StatisticsPanel
          name="WFTM"
          rewards={BASERewards}
          value={props.bondingCurveData?.accountBASE / 1e18}
          valueUSD={BASEPrice}
          check={true}
        />

        <StatisticsPanel
          name="vSOUL"
          value={props.bondingCurveData?.accountVTOKEN / 1e18}
          valueUSD={VTOKENPrice}
          check={false}
        />

        <StatisticsPanel
          name="Credit"
          value={props.bondingCurveData?.accountBorrowCredit / 1e18}
          valueUSD={creditPrice}
          check={false}
        />

        <StatisticsPanel
          name="Debt"
          value={props.bondingCurveData?.accountBorrowDebt / 1e18}
          valueUSD={debtPrice}
          check={false}
        />

        <Button
          size="lg"
          mt="16px"
          w="full"
          onClick={buttonAction}
          isLoading={isLoadingButton}
          loadingText={loaderText}
        >
          Claim
        </Button>
      </SwapContainer>
    </Box>
  );
}
