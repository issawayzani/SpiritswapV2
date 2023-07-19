import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { sizes } from '../../../styles/media';

export const Container = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  grid-template-columns: repeat(4, 1fr);
  padding: 10px 2px 0 0px;
`;
export const Button = styled(Box)`
  padding: 2px 8px;
  line-height: 14px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-color: #2e2a8c;
  border: 1px solid;
  color: #4640d3;
  background-color: #1d1a59;
  font-size: 14px;
  border-radius: 0.5em;
  text-align: center;
  transition: 100ms ease;
  width: 100%;
  user-select: none;
  @media (min-width: ${sizes.medium}px) {
    &:hover {
      color: white;
      background-color: #4f4ad3;
      cursor: pointer;
    }
  }
  @media (max-width: ${sizes.medium}px) {
    &:active {
      color: white;
      background-color: #4f4ad3;
      cursor: pointer;
    }
  }
`;
