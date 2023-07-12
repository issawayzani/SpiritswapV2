import { Flex, Spacer, Box } from '@chakra-ui/react';

export default function StatisticsPanel(props) {
  return (
    <Box className="border" borderRadius="md" mb="16px">
      <Flex py="spacing05" px="spacing04" w="full">
        <div className="item">{props.name}</div>
        <Spacer />
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
