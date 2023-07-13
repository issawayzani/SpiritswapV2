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
import {
  selectTokens,
  selectPortfolioValue,
  selectFarmRewards,
  selectShowPortfolio,
  selectLimitOrdersTotalValue,
} from 'store/user/selectors';
import {
  LENDANDBORROW,
  SOULC,
  FARMS,
  VSOULC,
  resolveRoutePath,
} from 'app/router/routes';
import { ConnectWallet } from 'app/components/ConnectWallet';
import {
  GetInspiritData,
  isVerifiedToken,
  GetLimitOrders,
  truncateTokenValue,
} from 'app/utils';
import {
  selectSpiritInfo,
  selectTokensToShow,
  selectBondingCurveInfo,
} from 'store/general/selectors';
import { SPIRIT, SPIRIT_DOCS_URL, TOKENS_TO_SHOW } from 'constants/index';
import { setPortfolioValue, setShowPortfolio } from 'store/user';
import MiniFooter from './components/MiniFooter';
import DexStatistics from './components/DexStatistics';

import { LendAndBorrowIcon, ApeIcon } from './../../assets/icons/index';
import { GelattoLimitOrder } from 'utils/swap/types';
import { openInNewTab } from 'app/utils/redirectTab';
import useMobile from 'utils/isMobile';
import { Animation } from 'app/components/Animations';
import browser from 'browser-detect';
import { breakpoints } from 'theme/base/breakpoints';
import {
  SwapAnimation,
  InspiritAnimation,
  LandingAnimation,
  LendingAnimation,
  FarmAnimation,
} from '../../assets/animations';
import useWallets from 'app/hooks/useWallets';

const PartnerItems = [
  {
    icon: PartnersIcons.LiquidDriverIcon,
    url: 'https://www.liquiddriver.finance/',
  },
  { icon: PartnersIcons.OlafinanceIcon, url: 'https://ola.finance/' },
  { icon: PartnersIcons.CovalentIcon, url: 'https://www.covalenthq.com/' },
  {
    icon: PartnersIcons.KekToolsIcon,
    url: `https://kek.tools/t/${SPIRIT.address}`,
  },
  { icon: PartnersIcons.Unidex, url: 'https://unidex.exchange/' },
  { icon: PartnersIcons.BeefyIcon, url: 'https://beefy.finance/' },
  { icon: PartnersIcons.LiFinanceIcon, url: 'https://li.fi/' },
  { icon: PartnersIcons.GelatoIcon, url: 'https://www.gelato.network/' },
  { icon: PartnersIcons.YearnIcon, url: 'https://yearn.finance/#/home' },
  { icon: PartnersIcons.ParaSwapIcon, url: 'https://www.paraswap.io/' },
  { icon: PartnersIcons.AbracadabraIcon, url: 'https://abracadabra.money/' },
  { icon: PartnersIcons.HedgeyIcon, url: 'https://hedgey.finance/' },
  { icon: PartnersIcons.GrimIcon, url: 'https://www.grim.finance/' },
  { icon: PartnersIcons.ReaperIcon, url: 'https://www.reaper.farm/' },
  { icon: PartnersIcons.BalancerIcon, url: 'https://balancer.fi/' },
  { icon: PartnersIcons.Cre8rIcon, url: 'https://cre8r.vip/' },
  {
    icon: PartnersIcons.BowTiedIcon,
    url: 'https://thereadingape.substack.com/',
  },
  { icon: PartnersIcons.AlchemixIcon, url: 'https://alchemix.fi/' },
  { icon: PartnersIcons.NftgarageIcon, url: 'https://nftgarage.world/' },
  { icon: PartnersIcons.RevestLogoIcon, url: 'https://revest.finance/' },
  { icon: PartnersIcons.MarketXyzIcon, url: 'https://www.market.xyz/' },
];

const Home = () => {
  const { t } = useTranslation();
  const pageTitle = `${t('common.name')} - ${t('common.menu.home')}`;
  const translationPath = 'home.common';
  const navigate = useNavigate();
  const isMobile = useMobile();
  const { isLoggedIn, account, liquidity, walletLiquidity } = useWallets();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useAppDispatch();
  const { name: browserName } = browser();
  const isSafariBrowser = browserName === 'safari';

  const [tokenData, setTokenData] = useState<balanceReturnData>({
    tokenList: [],
    farmList: [],
    diffAmount: '',
    diffAmountValue: 0,
    diffPercent: '',
    diffPercentValue: 0,
    totalValue: '',
    total24Value: '',
    totalValueNumber: 0,
    total24ValueNumber: 0,
  });
  const [liquidityData, setLiquidityData] = useState<balanceReturnData>({
    farmList: [],
    diffAmount: '',
    diffAmountValue: 0,
    diffPercent: '',
    diffPercentValue: 0,
    totalValue: '',
    total24Value: '',
    totalValueNumber: 0,
    total24ValueNumber: 0,
  });
  const [limitOrdersData, setLimitOrdersData] = useState<GelattoLimitOrder[]>(
    [],
  );

  const [farmRewards, setFarmRewards] = useState(0);
  const limitOrders = GetLimitOrders();
  const showPortfolio = useAppSelector(selectShowPortfolio);
  const tokensToShow = useAppSelector(selectTokensToShow);
  const rewards = useAppSelector(selectFarmRewards);
  const tokens = useAppSelector(selectTokens);
  const limitOrdersTotalValue = useAppSelector(selectLimitOrdersTotalValue);
  const portfolioAmountValue = useAppSelector(selectPortfolioValue);
  const { price: spiritPrice } = useAppSelector(selectSpiritInfo);

  const {
    balance,
    spiritLocked,
    nextSpiritDistribution,
    spiritClaimable,
    bribesClaimable,
    lockedEnd,
    spiritLockedValue,
  } = GetInspiritData();

  const inSpiritData = {
    userLockedAmount: Number(spiritLocked),
    userLockedAmountValue: Number(spiritLockedValue),
    inSpiritBalance: Number(balance),
    userClaimableAmount: Number(spiritClaimable),
    userBribesClaimableAmount: Number(bribesClaimable),
    userLockEndDate: lockedEnd,
    nextDistribution: nextSpiritDistribution,
  };

  const AboutSectionItems = [
    {
      id: 'SOULC',
      titleIcon: <SwapIcon />,
      translationPath: 'home.about.swap',
      buttonNavPath: { path: SOULC.path },
      image: Swap,
      animation: SwapAnimation,
    },
    {
      id: 'farms',
      titleIcon: <FarmsIcon />,
      translationPath: 'home.about.farms',
      buttonNavPath: { path: FARMS.path },
      image: Earn,
      animation: FarmAnimation,
    },
    {
      id: 'vSOULC',
      titleIcon: <InspiritIcon />,
      translationPath: 'home.about.inspirit',
      buttonNavPath: { path: VSOULC.path },
      image: Inspirit,
      animation: InspiritAnimation,
    },
    {
      id: 'lend',
      titleIcon: <LendAndBorrowIcon />,
      translationPath: 'home.about.lend',
      buttonNavPath: { path: LENDANDBORROW.url, targetSelf: true },
      image: Share,
      animation: LendingAnimation,
    },
  ];

  const handleGoToLanding = () => {
    dispatch(setShowPortfolio(false));
    navigate('');
  };

  const handleConnectButton = () => {
    if (isLoggedIn) dispatch(setShowPortfolio(true));
    else onOpen();
  };

  useEffect(() => {
    if (isLoggedIn) {
      if (rewards && rewards.length) {
        const totalRewards = rewards?.reduce(
          (total, reward) => total + parseFloat(`${reward.earned}`),
          0,
        );

        setFarmRewards(totalRewards / 10 ** 18);
      }
    }
  }, [rewards, isLoggedIn]);

  useEffect(() => {
    if (!tokens?.tokenList || !liquidity || !limitOrders || !account) return;

    setLiquidityData({
      ...liquidity,
      stakeList: walletLiquidity,
    });
    setLimitOrdersData(limitOrders);

    switch (tokensToShow) {
      case TOKENS_TO_SHOW.ALL:
        const tokensList_0: any = tokens.tokenList
          .map(token => token.originalItem)
          .filter(item => item);

        const response_0 = getTokenGroupStatistics(tokensList_0, 'tokenList');

        dispatch(
          setPortfolioValue(
            response_0.totalValueNumber + liquidity.totalValueNumber,
          ),
        );
        return setTokenData(response_0);
      case TOKENS_TO_SHOW.VERIFIED:
        const tokenList: any = tokens.tokenList
          .map(token => isVerifiedToken(token.address) && token.originalItem)
          .filter(item => item);

        const response = getTokenGroupStatistics(tokenList ?? [], 'tokenList');

        dispatch(
          setPortfolioValue(
            response.totalValueNumber + liquidity.totalValueNumber,
          ),
        );
        return setTokenData(response);
      case TOKENS_TO_SHOW.UNVERIFIED:
        const tokenList_1: any = tokens.tokenList
          .map(token => !isVerifiedToken(token.address) && token.originalItem)
          .filter(item => item);

        const response_1 = getTokenGroupStatistics(tokenList_1, 'tokenList');

        dispatch(
          setPortfolioValue(
            response_1.totalValueNumber + liquidity.totalValueNumber,
          ),
        );
        return setTokenData(response_1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensToShow, tokens, account, liquidity, dispatch, limitOrders]);

  const portfolioAmount =
    portfolioAmountValue +
    inSpiritData.userLockedAmount * spiritPrice +
    limitOrdersTotalValue;

  const landingAnimation = useCallback(() => {
    return (
      <Box mt="15vh">
        {isMobile ? <img src={Main} alt="spirit-logo" /> : null}
      </Box>
    );
  }, [isMobile]);

  const BondingCurveData = useAppSelector(selectBondingCurveInfo);
  const [isLimit, setIsLimit] = useState<boolean>(false);
  const [isLessThan1100px] = useMediaQuery('(max-width: 1100px)');

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
          {isLoggedIn && showPortfolio ? (
            <PortfolioWrapper>
              <div className="top">
                <TopCard
                  icon="fa-users"
                  TVL={BondingCurveData?.tvl / 1e18}
                  supplyVTOKEN={BondingCurveData?.supplyVTOKEN}
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
                  />
                  <h5 className="portfolio-title">
                    {t(`${translationPath}.harvest`)}
                  </h5>
                  <HarvestCard
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
                      TVL={BondingCurveData?.tvl / 1e18}
                      supplyVTOKEN={BondingCurveData?.supplyVTOKEN}
                      APR={BondingCurveData?.apr / 1e18}
                      supplyTOKEN={BondingCurveData?.supplyTOKEN / 1e18}
                      LTV={BondingCurveData?.ltv / 1e18}
                      Ratio={BondingCurveData?.ratio / 1e18}
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
                      />
                      <h5 className="portfolio-title">
                        {t(`${translationPath}.harvest`)}
                      </h5>
                      <div className="portfolio-subtitle">
                        {t(`${translationPath}.connect`)}
                      </div>
                      <HarvestCard
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
