import { Flex, Spacer, Box } from '@chakra-ui/react';

export default function StatisticsPanel(props) {
  return (
    <Box className="border" borderRadius="md" mb="16px">
      <Flex w="full">
        <img src={props.icon}></img>
        <div className="item">{props.name}</div>
        <Spacer />
        <div className="right-section">
          <span className="item-count">
            {props.valueUSD} {props.name}
          </span>
          <br />
          <span className="item-price">Balance: ${props.value}</span>
        </div>
      </Flex>
    </Box>
  );
}
