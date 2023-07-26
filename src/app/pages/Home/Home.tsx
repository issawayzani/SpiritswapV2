import { useState, useEffect, useCallback } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { balanceReturnData, fiat, getTokenGroupStatistics } from 'utils/data';
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/js/bootstrap.js";
import {
  Box,
  Button,
  Flex,
  Stack,
  useDisclosure,
  Grid,
  GridItem,
  useMediaQuery,
} from '@chakra-ui/react';
import PartnersIcons from './PartnersIcons';
import { useNavigate } from 'app/hooks/Routing';
import {
  SwapIcon,
  FarmsIcon,
  BridgeIcon,
  InspiritIcon,
  Ape,
  Swap,
  Earn,
  Main,
  Bridge,
  Inspirit,
  Share,
} from './index';
import { ArrowRightIcon } from 'app/assets/icons';
import {
  AboutSectionItem,
  PartnersSection,
  WalletPanel,
  Portfolio,
  TopCard,
  TopRightCard,
  HarvestCard,
} from './components';
import {
  Wrapper,
  ContentWrapper,
  WalletWrapper,
  WalletTitle,
  StyledWalletDescription,
  WalletButtonWrapper,
  WalletPanelWrapper,
  PortfolioWrapper,
} from './styles';

import { ConnectWallet } from 'app/components/ConnectWallet';

import { selectBondingCurveInfo } from 'store/general/selectors';
import useMobile from 'utils/isMobile';
import browser from 'browser-detect';
import { breakpoints } from 'theme/base/breakpoints';
import useWallets from 'app/hooks/useWallets';
import { setBondingCurveInfo } from 'store/general';
import { getBondingCurveData, Test } from 'utils/web3';

const Home = () => {
  const { t } = useTranslation();
  const pageTitle = `${t('common.name')} - ${t('common.menu.home')}`;
  const translationPath = 'home.common';
  const navigate = useNavigate();
  const isMobile = useMobile();
  const { isLoggedIn, account } = useWallets();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useAppDispatch();
  const { name: browserName } = browser();
  const isSafariBrowser = browserName === 'safari';

  const handleConnectButton = () => {};

  const BondingCurveData = useAppSelector(selectBondingCurveInfo);
  const [isLimit, setIsLimit] = useState<boolean>(false);
  const [isLessThan1100px] = useMediaQuery('(max-width: 1100px)');

  useEffect(() => {
    const fetch = async () => {
      const data = await Test(account, null, null);
      dispatch(setBondingCurveInfo(data?.result));
    };

    let intervalId;

    if (account) {
      fetch();
      intervalId = setInterval(fetch, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [account]);

  const columns = () => {
    const columns = { base: '95%' };

    if (isLimit) {
      if (isLessThan1100px) columns['md'] = '520px';
      else columns['md'] = '520px 1fr';
      return columns;
    }

    columns['md'] = '700px 1fr';
    return columns;
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content="A Boilerplate application home" />
        </Helmet>
      </HelmetProvider>

      <Wrapper>
        <ContentWrapper>
          {isLoggedIn ? (
            <PortfolioWrapper>
              <div className="top">
                <TopCard
                  icon="fa-users"
                  TVL={BondingCurveData?.tvl / 1e18}
                  supplyVTOKEN={BondingCurveData?.supplyVTOKEN / 1e18}
                  APR={BondingCurveData?.apr / 1e18}
                  supplyTOKEN={BondingCurveData?.supplyTOKEN / 1e18}
                  LTV={BondingCurveData?.ltv / 1e18}
                  Ratio={BondingCurveData?.ratio / 1e18}
                />
                <div className="portfolio-section">
                  <h5 className="portfolio-title">
                    {t(`${translationPath}.portfolio`)}
                  </h5>
                  <TopRightCard
                    account={account}
                    bondingCurveData={BondingCurveData}
                    check={false}
                  />
                  <h5 className="portfolio-title">
                    {t(`${translationPath}.harvest`)}
                  </h5>
                  <HarvestCard
                    check={false}
                    account={account}
                    bondingCurveData={BondingCurveData}
                  />
                </div>
              </div>
              {/* <Portfolio
                translationPath="home.portfolio"
                amount={fiat(portfolioAmount)}
                tokensData={tokenData}
                liquidityData={liquidityData}
                inSpiritData={inSpiritData}
                limitOrdersData={limitOrdersData}
                onClickLandingButton={handleGoToLanding}
              /> */}
            </PortfolioWrapper>
          ) : (
            <>
              <WalletWrapper isMobile={isMobile}>
                <Box>
                  <div className="top">
                    <TopCard
                      icon="fa-users"
                      TVL="Connect Wallet"
                      supplyVTOKEN="Connect Wallet"
                      APR="Connect Wallet"
                      supplyTOKEN="Connect Wallet"
                      LTV="Connect Wallet"
                      Ratio="Connect Wallet"
                      check={true}
                    />
                    <div className="portfolio-section">
                      <h5 className="portfolio-title">
                        {t(`${translationPath}.portfolio`)}
                      </h5>
                      <div className="portfolio-subtitle">
                        {t(`${translationPath}.connect`)}
                      </div>
                      <TopRightCard
                        account={account}
                        bondingCurveData={BondingCurveData}
                        check={true}
                      />
                      <h5 className="portfolio-title">
                        {t(`${translationPath}.harvest`)}
                      </h5>
                      <div className="portfolio-subtitle">
                        {t(`${translationPath}.connect`)}
                      </div>
                      <HarvestCard
                        check={true}
                        account={account}
                        bondingCurveData={BondingCurveData}
                      />
                    </div>
                  </div>
                </Box>
                <ConnectWallet isOpen={isOpen} dismiss={onClose} />
              </WalletWrapper>
            </>
          )}
        </ContentWrapper>
      </Wrapper>
    </>
  );
};

export default Home;
