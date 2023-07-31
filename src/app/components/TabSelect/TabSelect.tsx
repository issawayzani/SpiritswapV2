import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

interface TabSelectProps {
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

export default function TabSelect({
  names,
  panels,
  setIndex,
  index,
  styleIndex,
  styleVariant,
  onSelect,
  w = 'fit-content',
  mx = '0px',
}: TabSelectProps) {
  return (
    <Tabs
      variant={styleIndex?.includes(index) ? styleVariant : 'unstyled'}
      onChange={index => setIndex(index)}
      index={index}
      mx={mx}
    >
      <TabList className="vertical-tabs" w={w} aria-orientation="vertical">
        {names.map(name => (
          <Tab
            _selected={{ color: '#FFF', bg: '#2E2A8C' }}
            _hover={{ color: '#A19ED3', bg: '#1D1A59' }}
            className="tab-button"
            key={name}
            onClick={() => onSelect && onSelect(name)}
          >
            {name}
            {/* <span className="settings-text">
          <i className="fa fa-question-circle-o margin"></i>Lorem ipsum dolor sit amet.
        </span> */}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="vertical-tabs">
        {panels?.map(({ key, children }) => (
          <TabPanel key={key}>{children}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
