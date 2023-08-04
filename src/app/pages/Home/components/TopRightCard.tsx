import { Box } from '@chakra-ui/react';
import { SwapContainer } from '../portfolioStyles';
import '../../../../styles.css';
import { StatisticsPanel } from './Panels';
import xglov3 from '../../../assets/images/xglov3.svg';
import fantom from '../../../assets/images/fantom-logo.svg';

export default function TopRightCard(props) {
  const VTOKENPrice =
    (props.bondingCurveData?.priceTOKEN *
      props.bondingCurveData?.accountVTOKEN) /
    1e36;
  const creditPrice =
    (props.bondingCurveData?.priceBASE *
      props.bondingCurveData?.accountBorrowCredit) /
    1e36;
  const debtPrice =
    (props.bondingCurveData?.priceBASE *
      props.bondingCurveData?.accountBorrowCredit) /
    1e36;
  return (
    <Box>
      <SwapContainer>
        <StatisticsPanel
          check={props.check}
          icon={xglov3}
          name="XGLOV3"
          value={props.bondingCurveData?.accountVTOKEN / 1e18}
          valueUSD={VTOKENPrice}
        />

        <StatisticsPanel
          check={props.check}
          icon={fantom}
          name="Credit"
          value={props.bondingCurveData?.accountBorrowCredit / 1e18}
          valueUSD={creditPrice}
        />

        <StatisticsPanel
          check={props.check}
          icon={fantom}
          name="Debit"
          value={props.bondingCurveData?.accountBorrowDebt / 1e18}
          valueUSD={debtPrice}
        />
      </SwapContainer>
    </Box>
  );
}
