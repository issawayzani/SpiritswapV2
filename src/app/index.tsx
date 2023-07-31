import { Helmet } from 'react-helmet-async';

import { GlobalStyle } from '../styles/global-styles';
import { useTranslation } from 'react-i18next';
import { SiteRouting, RootPathContext } from 'app/router';

import Layers from './assets/background';
import { Box } from '@chakra-ui/react';
import { CHAIN_ID, SPIRIT, WCANTO } from 'constants/index';
import { getTokenUsdPrice } from 'utils/data';
import { useEffect, useState } from 'react';
import { getInspiritStatistics } from '../utils/data/inspirit';

const GlobalStyleProxy: any = GlobalStyle;

export function App() {
  const { i18n } = useTranslation();
  const [cantoPrice, setCantoPrice] = useState(0);
  const rootPath = document.documentElement.dataset['rootPath'] || '/';

  useEffect(() => {
    const fetchPrice = async () => {
      const prices = await getInspiritStatistics();
      const { cantoInfo } = prices;
      if (prices && cantoInfo) {
        setCantoPrice(cantoInfo.price);
      }
    };
    fetchPrice();
  }, []);

  const Layout = ({ children }) => <Box>{children}</Box>;

  return (
    <RootPathContext.Provider value={rootPath}>
      <Helmet
        titleTemplate={`ConvergeX - $${cantoPrice.toFixed(3)}`}
        defaultTitle={`ConvergeX - $${cantoPrice.toFixed(3)}`}
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="ConvergeX webapp" />
      </Helmet>
      <GlobalStyleProxy />

      <Layout>
        <>
          <Layers />
          <SiteRouting />
        </>
      </Layout>
    </RootPathContext.Provider>
  );
}
