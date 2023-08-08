import styled from '@emotion/styled';
import { Box, HStack, IconButton } from '@chakra-ui/react';

export const SwapContainer = styled(Box)<{ isLimit: boolean }>`
  border-radius: 8px;
  // border: 1px solid ${({ theme }) => `${theme.colors.grayBorderBox}`};
  // background: ${({ theme }) => theme.colors.bgBox};
  margin: 133px auto;
  display: flex;
  width: 50%;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  // padding: ${({ theme }) => theme.space.spacing03};
`;

export const StyledIcon = styled(IconButton)`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.ci};
`;

export const RouteContainer = styled(HStack)<{ showchart: boolean }>`
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 10px 25px;
  }
  margin-top: ${({ theme }) => theme.space.spacing03};
  width: 100%;
  padding: 10px;
  justify-content: space-between;
  border: 1px solid rgba(55, 65, 81, 1);
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bgBox};
`;
