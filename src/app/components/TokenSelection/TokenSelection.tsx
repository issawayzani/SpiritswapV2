import { FC } from 'react';
import type { Props } from './TokenSelection.d';
import { Flex, Text } from '@chakra-ui/react';
import ImageLogo from '../ImageLogo';
import { CaretDownIcon } from 'app/assets/icons';

const TokenSelection: FC<Props> = ({
  symbol,
  handleOpen,
  src,
  isSelectable,
}: Props) => {
  return (
    <Flex
      alignItems="center"
      borderRadius="4px"
      borderWidth="1px"
      borderColor="#2E2A8C"
      px="spacing02"
      className="token-vote"
      _hover={{
        cursor: isSelectable ? 'pointer' : 'default',
      }}
      onClick={handleOpen}
    >
      <ImageLogo symbol={symbol} src={src} size="26px" />
      <Text className="vote-symbol">{symbol}</Text>
      {isSelectable && handleOpen && <CaretDownIcon />}
    </Flex>
  );
};

export default TokenSelection;
