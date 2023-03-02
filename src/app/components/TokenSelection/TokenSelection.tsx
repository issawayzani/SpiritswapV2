import { FC } from 'react';
import type { Props } from './TokenSelection.d';
import { Flex, Text } from '@chakra-ui/react';
import ImageLogo from '../ImageLogo';

const TokenSelection: FC<Props> = ({
  symbol,
  handleOpen,
  src,
  isSelectable,
}: Props) => {
  return (
    <Flex
      alignItems="center"
      borderRadius="2px"
      px="spacing02"
      _hover={{
        bg: 'none',
        cursor: 'default',
      }}
    >
      <ImageLogo symbol={symbol} src={src} size="28px" />
      <Text fontSize="xl2">{symbol}</Text>
    </Flex>
  );
};

export default TokenSelection;
