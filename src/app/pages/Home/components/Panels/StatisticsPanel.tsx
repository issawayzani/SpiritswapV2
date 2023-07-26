import { Flex, Spacer, Box } from '@chakra-ui/react';

export default function StatisticsPanel(props) {
  return (
    <Box className="border" borderRadius="md" mb="16px">
      <Flex w="full">
        <div className="width-100">
          <div className="float-left">
            <img className="float-left" src={props.icon}></img>
            <div className="item float-left">{props.name}</div>
          </div>
          <div className="float-right">
            <span className="item-count">
              {props.check ? 'Connect Wallet' : props.value}{' '}
              {props.check ? '' : props.name}
            </span>
            <br />
            <span className="item-price">
              Balance: ${props.check ? '0.0' : props.valueUSD}
            </span>
          </div>
        </div>
      </Flex>
    </Box>
  );
}
