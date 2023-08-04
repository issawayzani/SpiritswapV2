import { Select } from '@chakra-ui/react';
import styled from '@emotion/styled';
import ImageLogo from 'app/components/ImageLogo';

const StyledOption = styled.option`
  // color:#fff;
  border: none;
  border-radius: 8px;
  background: rgba(29, 26, 89, 0.9);
  box-shadow: 0px 34px 88px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(7.5px);
  color: var(--gray-10, #a19ed3);
  width: 100%;
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
      className="vote-dropdown"
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
            <ImageLogo margin="0" symbol="ftm" size="27px" />
            {symbol}
          </StyledOption>
        );
      })}
    </Select>
  );
};
