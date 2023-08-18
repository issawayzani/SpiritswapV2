import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

interface TabSelectOldProps {
  names: string[];
  panels?: {
    key: number;
    children: React.ReactNode;
  }[];
  setIndex: (index: number) => void;
  index: number;
  styleIndex?: number[];
  styleVariant?: string;
  w?: string;
  mx?: string;
  onSelect?: (value: string) => void;
}

export default function TabSelectOld({
  names,
  panels,
  setIndex,
  index,
  styleIndex,
  styleVariant,
  onSelect,
  w = 'fit-content',
  mx = '20px',
}: TabSelectOldProps) {
  return (
    <Tabs
      size="sm"
      variant={styleIndex?.includes(index) ? styleVariant : 'unstyled'}
      onChange={index => setIndex(index)}
      index={index}
      mx={mx}
    >
      <TabList w={w} className="tab-list">
        {names.map(name => (
          <Tab
            w={w}
            key={name}
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
            className="subtitle-settings swapsettings"
            onClick={() => onSelect && onSelect(name)}
          >
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {panels?.map(({ key, children }) => (
          <TabPanel key={key}>{children}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
