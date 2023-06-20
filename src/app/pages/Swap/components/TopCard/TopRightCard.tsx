import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { SwapContainer } from '../../styles';
import './styles.css';
import { StatisticsPanel } from '../Panels';
export default function TopRightCard(props) {
  const powerPrice =
    (props.bondingCurveData?.priceOTOKEN *
      props.bondingCurveData?.accountOTOKEN) /
    1e18;
  const glovePrice =
    (props.bondingCurveData?.priceTOKEN *
      props.bondingCurveData?.accountTOKEN) /
    1e18;
  const OPPrice =
    (props.bondingCurveData?.priceBASE * props.bondingCurveData?.accountBASE) /
    1e18;
  const xGLOVEPrice =
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
    //need to get the rewards here
  };
  return (
    <Box mb="10px">
      <SwapContainer>
        <StatisticsPanel
          name="oSOUL"
          rewards={props.bondingCurveData?.accountEarnedOTOKEN / 1e18}
          value={props.bondingCurveData?.accountOTOKEN / 1e18}
          valueUSD={powerPrice}
          check={true}
        />

        <StatisticsPanel
          name="SOUL"
          rewards={props.bondingCurveData?.accountEarnedTOKEN / 1e18}
          value={props.bondingCurveData?.accountTOKEN / 1e18}
          valueUSD={glovePrice}
          check={true}
        />
        <StatisticsPanel
          name="WFTM"
          rewards={props.bondingCurveData?.accountEarnedBASE / 1e18}
          value={props.bondingCurveData?.accountBASE / 1e18}
          valueUSD={OPPrice}
          check={true}
        />

        <StatisticsPanel
          name="vSOUL"
          value={props.bondingCurveData?.accountVTOKEN / 1e18}
          valueUSD={xGLOVEPrice}
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

        <Button size="lg" mt="16px" w="full" onClick={buttonAction}>
          Harvest
        </Button>
      </SwapContainer>
    </Box>
  );
}
