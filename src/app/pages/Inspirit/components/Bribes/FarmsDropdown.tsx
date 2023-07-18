import { Select } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledOption = styled.option`
  background: ${({ theme }) => theme.colors.bgBox};
`;

export const FarmsDropdown = ({ farms, value, onChange, ...props }) => {
  const onChangeHandler = (e: { target: { value: string } }) => {
    onChange(e.target.value);
  };

  return (
    <Select
      width="100%"
      onChange={onChangeHandler}
      {...props}
      value={value}
      disabled={!farms || farms.length === 0}
      outline={'none'}
      borderColor="#2E2A8C"
      _focus={{
        boxShadow: 'none',
        borderColor: '#2E2A8C',
      }}
    >
      {(!farms || farms.length === 0) && (
        <StyledOption>Loading...</StyledOption>
      )}

      {farms.map(farm => {
        const { plugin, symbol } = farm;
        // const [tokenA, tokenB] = name.split(' ');
        return (
          <StyledOption key={`${symbol}`} value={plugin}>
            {symbol}
          </StyledOption>
        );
      })}
    </Select>
  );
};
