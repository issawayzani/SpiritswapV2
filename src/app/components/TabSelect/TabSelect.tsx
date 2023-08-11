import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

interface TabSelectProps {
  names?: {
    key: number;
    name: string;
    className: string;
  }[];
  price?: string[];
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
  price,
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
      <TabList className="panel-list">
        {names?.map(({ key, name, className }) => (
          <Tab
            _selected={{ color: '#F3F2FF', bg: '#22ABAC', zIndex: '3' }}
            _hover={{ color: '#F3F2FF', bg: '#22ABAC', zIndex: '3' }}
            className={className}
            key={key}
            onClick={() => onSelect && onSelect(name)}
          >
            {name}
            {/* <span className="settings-text">
          <i className="fa fa-question-circle-o margin"></i>Lorem ipsum dolor sit amet.
        </span> */}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {panels?.map(({ key, children }) => (
          <TabPanel className="panel-padding" key={key}>
            {children}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
