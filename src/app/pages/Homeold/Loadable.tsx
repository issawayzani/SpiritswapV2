import { Center } from '@chakra-ui/react';
import { lazyLoad } from 'utils/loadable';

export const HomePageOld = lazyLoad(
  () => import('./index'),
  module => module.Homeold,
  {
    fallback: <Center h="100vh" />,
  },
);
