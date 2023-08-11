import { Box, Stack } from '@chakra-ui/react';
import TabSelect from 'app/components/TabSelect';
import { DepositPanel, WithdrawPanel, BurnPanel, OptionsPanel } from './';

import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectStakeIndex } from 'store/general/selectors';
import { useEffect, useState } from 'react';
import { setGlobalStakeIndex } from 'store/general';
import SettingSwap from 'app/assets/images/setting-new.svg';

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
  const tabNames = [
    {
      key: 0,
      name: 'Stake',
      className: 'panel-button-left',
    },
    {
      key: 1,
      name: 'Unstake',
      className: 'panel-button-right',
    },
    {
      key: 2,
      name: 'Burn',
      className: 'panel-button-right',
    },
  ];
  useEffect(() => {
    dispatch(setGlobalStakeIndex(stakeIndex));
  }, [stakeIndex, globalStakeIndex]);

  return (
    <Box mt="10px">
      <div className="swap-token">
        Swap Tokens{' '}
        <span className="swap-icon">
          <img src={SettingSwap} />
        </span>
      </div>
      <TabSelect
        index={stakeIndex}
        setIndex={setStakeIndex}
        styleIndex={[2]}
        styleVariant="danger"
        names={tabNames}
        panels={stakePanels}
      />
    </Box>
  );
}
