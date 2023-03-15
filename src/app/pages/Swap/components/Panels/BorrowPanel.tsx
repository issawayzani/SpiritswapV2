import { Box, Stack } from '@chakra-ui/react';
import TabSelect from 'app/components/TabSelect';
import { BorrowRepayPanel } from './';

import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectBorrowIndex } from 'store/general/selectors';
import { useEffect, useState } from 'react';
import { setGlobalBorrowIndex } from 'store/general';

export default function BorrowPanel(props) {
  const dispatch = useAppDispatch();
  const globalBorrowIndex = useAppSelector(selectBorrowIndex);
  const [borrowIndex, setBorrowIndex] = useState<number>(
    globalBorrowIndex || 0,
  );
  const borrowPanels = [
    {
      key: 0,
      children: (
        <BorrowRepayPanel
          borrow={true}
          buttonText="Borrow"
          balanceText="Credit : "
        />
      ),
    },
    {
      key: 1,
      children: (
        <BorrowRepayPanel
          repay={true}
          buttonText="Repay"
          balanceText="Debt: "
        />
      ),
    },
  ];
  useEffect(() => {
    dispatch(setGlobalBorrowIndex(borrowIndex));
  }, [borrowIndex, globalBorrowIndex]);

  return (
    <Box mt="10px">
      <TabSelect
        index={borrowIndex}
        setIndex={setBorrowIndex}
        styleIndex={[2]}
        styleVariant="danger"
        names={['Borrow', 'Repay']}
        panels={borrowPanels}
      />
    </Box>
  );
}
