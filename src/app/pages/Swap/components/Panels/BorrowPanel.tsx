import { Box, Stack, Center, Button } from '@chakra-ui/react';
import TabSelect from 'app/components/TabSelect';
import { BorrowRepayPanel } from './';

import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectBorrowIndex } from 'store/general/selectors';
import { useEffect, useState } from 'react';
import { setGlobalBorrowIndex } from 'store/general';
import SettingSwap from 'app/assets/images/setting-new.svg';
import SwapIconNew from 'app/assets/images/swap-icon.svg';
import { SwapProps } from '../../Swap.d';

export default function BorrowPanel(props) {
  const dispatch = useAppDispatch();
  const globalBorrowIndex = useAppSelector(selectBorrowIndex);
  const [borrowIndex, setBorrowIndex] = useState<number>(
    globalBorrowIndex || 0,
  );
  const { toggleSettings }: SwapProps = props;
  const borrowPanels = [
    {
      key: 0,
      children: (
        <BorrowRepayPanel
          account={props?.account}
          borrow={true}
          buttonText="Borrow"
          balanceText="Credit : "
          bondingCurveData={props?.bondingCurveData}
        />
      ),
    },
    {
      key: 1,
      children: (
        <BorrowRepayPanel
          account={props?.account}
          repay={true}
          buttonText="Repay"
          balanceText="Debt: "
          bondingCurveData={props?.bondingCurveData}
        />
      ),
    },
  ];
  const tabNames = [
    {
      key: 0,
      name: 'Borrow',
      className: 'panel-button-left',
    },
    {
      key: 1,
      name: 'Repay',
      className: 'panel-button-right',
    },
  ];
  useEffect(() => {
    dispatch(setGlobalBorrowIndex(borrowIndex));
  }, [borrowIndex, globalBorrowIndex]);

  return (
    <Box className="position-relative">
      <div className="swap-token">
        Swap Tokens{' '}
        <span className="swap-icon">
          <Button
            p="0"
            bg="transparent"
            border="none"
            minW="0"
            _active={{ border: 'none' }}
          >
            <img src={SettingSwap} onClick={toggleSettings} />
          </Button>
        </span>
      </div>
      <TabSelect
        index={borrowIndex}
        setIndex={setBorrowIndex}
        styleIndex={[2]}
        styleVariant="danger"
        names={tabNames}
        panels={borrowPanels}
      />
    </Box>
  );
}
