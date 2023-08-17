import { Box, Stack, Button } from '@chakra-ui/react';
import TabSelect from 'app/components/TabSelect';
import { ExercisePanel, RedeemPanel } from './';
import { SwapProps } from '../../Swap.d';

import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectOptionsIndex } from 'store/general/selectors';
import { useEffect, useState } from 'react';
import { setGlobalOptionsIndex } from 'store/general';
import SettingSwap from 'app/assets/images/setting-new.svg';

export default function OptionsPanel(props) {
  const dispatch = useAppDispatch();
  const globalOptionsIndex = useAppSelector(selectOptionsIndex);
  const [optionsIndex, setOptionsIndex] = useState<number>(
    globalOptionsIndex || 0,
  );
  const optionsPanels = [
    {
      key: 0,
      children: (
        <ExercisePanel
          account={props?.account}
          bondingCurveData={props?.bondingCurveData}
        />
      ),
    },
    {
      key: 1,
      children: (
        <RedeemPanel
          account={props?.account}
          bondingCurveData={props?.bondingCurveData}
        />
      ),
    },
  ];
  const { toggleSettings }: SwapProps = props;
  const tabNames = [
    {
      key: 0,
      name: 'Exercise',
      className: 'panel-button-left',
    },
    {
      key: 1,
      name: 'Redeem',
      className: 'panel-button-right',
    },
  ];
  useEffect(() => {
    dispatch(setGlobalOptionsIndex(optionsIndex));
  }, [optionsIndex, globalOptionsIndex]);

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
        index={optionsIndex}
        setIndex={setOptionsIndex}
        styleIndex={[2]}
        styleVariant="danger"
        names={tabNames}
        panels={optionsPanels}
      />
    </Box>
  );
}
