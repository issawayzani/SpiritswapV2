import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { SwapContainer } from '../../styles';
import './styles.css';
import { StatisticsPanel } from '../Panels';
export default function TopRightCard(props) {
  const buttonAction = async () => {
    //need to get the rewards here
  };
  return (
    <Box mb="10px">
      <SwapContainer>
        <StatisticsPanel name="SOULC" rewards="0" value="0" check={true} />

        <StatisticsPanel name="WCANTO" rewards="0" value="0" check={true} />
        <StatisticsPanel name="vSOULC" value="0" check={false} />

        <StatisticsPanel name="Voting Power" value="0" check={false} />

        <StatisticsPanel name="Borrow Credit" value="0" check={false} />

        <StatisticsPanel name="Borrow Debt" value="0" check={false} />

        <Button size="lg" mt="16px" w="full" onClick={buttonAction}>
          Claim Rewards
        </Button>
      </SwapContainer>
    </Box>
  );
}
