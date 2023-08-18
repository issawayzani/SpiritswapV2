import {
  Tabs,
  TabList,
  Tab,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { SLIPPAGE_TOLERANCES, SLIPPAGE_ID } from 'utils/swap';
import { TabSelectProps } from './TabSelectInput.d';

export default function TabSelectInput({
  index,
  customInput,
  handleCustomInput,
  warningSlip,
}: TabSelectProps) {
  return (
    <Tabs index={index} variant={customInput ? 'unSelected' : 'unstyled'}>
      <TabList className="tab-list" w="full" p="4px" gap="8px">
        {SLIPPAGE_TOLERANCES.map(name => (
          <Tab
            w="22%"
            key={`slippage-${SLIPPAGE_ID[name]}`}
            onClick={() =>
              handleCustomInput(SLIPPAGE_TOLERANCES[SLIPPAGE_ID[name]])
            }
            className="subtitle-settings swapsettings"
            _selected={{
              bg: 'ciTrans15',
              color: '#F3F2FF',
              borderRadius: 'md',
            }}
            _hover={{
              bg: 'ciTrans15',
              color: '#F3F2FF',
              borderRadius: 'md',
            }}
          >
            {name === 'Auto' ? name : `${name}%`}
          </Tab>
        ))}
        <NumberInput
          min={0.1}
          max={50}
          onFocus={() => handleCustomInput('0')}
          value={customInput}
          className="swapInput"
          isInvalid={+customInput >= warningSlip}
          onChange={customInput => handleCustomInput(customInput)}
        >
          <NumberInputField
            _invalid={{ borderColor: 'yellow.500', color: 'yellow.500' }}
            placeholder="Custom"
            textAlign="center"
            fontSize="sm"
            className="swapInput"
            w="full"
            paddingInline="0px"
            sx={{
              '::placeholder': {
                color: '#f3f2ff',
              },
            }}
          />
        </NumberInput>
      </TabList>
    </Tabs>
  );
}
