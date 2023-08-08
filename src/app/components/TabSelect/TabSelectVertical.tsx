import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

interface TabSelectProps {
  names?: {
    key: number;
    name: string;
    text: string;
  }[];
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

export default function TabSelectVertical({
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
      orientation="vertical"
      display="flex"
      gridTemplateColumns="auto 1fr"
      variant={styleIndex?.includes(index) ? styleVariant : 'unstyled'}
      onChange={index => setIndex(index)}
      index={index}
      mx={mx}
    >
      <TabList className="vertical-tabs" w={w} aria-orientation="vertical">
        {names?.map(({ key, name, text }) => (
          <Tab
            _selected={{ color: '#FFF', bg: '#2E2A8C' }}
            _hover={{ color: '#A19ED3', bg: '#1D1A59' }}
            className="tab-button"
            key={key}
            onClick={() => onSelect && onSelect(name)}
          >
            {name}
            <span className="settings-text">
              <i className="fa fa-question-circle-o margin"></i>
              {text}
            </span>
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
