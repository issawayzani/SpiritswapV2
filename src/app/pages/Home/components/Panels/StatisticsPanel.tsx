import { Flex, Spacer, Box } from '@chakra-ui/react';

export default function StatisticsPanel(props) {
  return (
    <Box mt="16px" bg="bgBoxLighter" borderRadius="md">
      <Flex py="spacing05" px="spacing04" w="full">
        <div className="item">{props.name}</div>
        <Spacer />

        {props.check && <div className="item">Rewards: {props.rewards}</div>}
        {props.check && <Spacer />}

        <div className="item">{props.value}</div>
      </Flex>
      <Flex>
        <Spacer />
        <Flex>~${props.valueUSD}</Flex>
      </Flex>
    </Box>
  );
}
