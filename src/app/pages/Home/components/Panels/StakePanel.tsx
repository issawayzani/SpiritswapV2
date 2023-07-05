import { Box, Stack } from '@chakra-ui/react';
import TabSelect from 'app/components/TabSelect';
import { DepositPanel, WithdrawPanel, BurnPanel, OptionsPanel } from './';

import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectStakeIndex } from 'store/general/selectors';
import { useEffect, useState } from 'react';
import { setGlobalStakeIndex } from 'store/general';

export default function StakePanel(props) {
  const dispatch = useAppDispatch();
  const globalStakeIndex = useAppSelector(selectStakeIndex);
  const [stakeIndex, setStakeIndex] = useState<number>(globalStakeIndex || 0);
  const stakePanels = [
    {
      key: 0,
      children: (
        <DepositPanel
          account={props?.account}
          bondingCurveData={props?.bondingCurveData}
        />
      ),
    },
    {
      key: 1,
      children: (
        <WithdrawPanel
          account={props?.account}
          bondingCurveData={props?.bondingCurveData}
        />
      ),
    },
    {
      key: 2,
      children: (
        <BurnPanel
          account={props?.account}
          bondingCurveData={props?.bondingCurveData}
        />
      ),
    },
  ];
  useEffect(() => {
    dispatch(setGlobalStakeIndex(stakeIndex));
  }, [stakeIndex, globalStakeIndex]);

  return (
    <Box mt="10px">
      <TabSelect
        index={stakeIndex}
        setIndex={setStakeIndex}
        styleIndex={[2]}
        styleVariant="danger"
        names={['Stake', 'Unstake', 'Burn']}
        panels={stakePanels}
      />
    </Box>
  );
}
