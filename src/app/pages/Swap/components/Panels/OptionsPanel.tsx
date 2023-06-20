import { Box, Stack } from '@chakra-ui/react';
import TabSelect from 'app/components/TabSelect';
import { ExercisePanel, RedeemPanel } from './';

import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectOptionsIndex } from 'store/general/selectors';
import { useEffect, useState } from 'react';
import { setGlobalOptionsIndex } from 'store/general';

export default function OptionsPanel(props) {
  const dispatch = useAppDispatch();
  const globalOptionsIndex = useAppSelector(selectOptionsIndex);
  const [optionsIndex, setOptionsIndex] = useState<number>(
    globalOptionsIndex || 0,
  );
  const optionsPanels = [
    {
      key: 0,
      children: <ExercisePanel bondingCurveData={props?.bondingCurveData} />,
    },
    {
      key: 1,
      children: <RedeemPanel bondingCurveData={props?.bondingCurveData} />,
    },
  ];
  useEffect(() => {
    dispatch(setGlobalOptionsIndex(optionsIndex));
  }, [optionsIndex, globalOptionsIndex]);

  return (
    <Box mt="10px">
      <TabSelect
        index={optionsIndex}
        setIndex={setOptionsIndex}
        styleIndex={[2]}
        styleVariant="danger"
        names={['Exercise', 'Redeem']}
        panels={optionsPanels}
      />
    </Box>
  );
}
