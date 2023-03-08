import { Box } from '@chakra-ui/react';

export default function BorrowRepayPanel(props) {
  return (
    <Box>
      {props.borrow && (
        <div>
          {' '}
          <p> Borrow WCANTO against staked position </p>
        </div>
      )}
      {props.repay && (
        <div>
          {' '}
          <p> Repay WCANTO to unlock staked position </p>
        </div>
      )}
    </Box>
  );
}
