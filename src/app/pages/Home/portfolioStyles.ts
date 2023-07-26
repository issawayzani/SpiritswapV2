import styled from '@emotion/styled';
import { Box, HStack, IconButton } from '@chakra-ui/react';

export const SwapContainer = styled(Box)<{ isLimit: boolean }>`
  border-radius: 8px;
  // border: 1px solid ${({ theme }) => `${theme.colors.grayBorderBox}`};
  // background: ${({ theme }) => theme.colors.bgBox};
  padding: ${({ theme }) => theme.space.spacing03};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0 auto;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.xxs}) {
    width: 100%;
    padding: 0;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.xs}) {
    width: 100%;
    padding: 0;
  }
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
