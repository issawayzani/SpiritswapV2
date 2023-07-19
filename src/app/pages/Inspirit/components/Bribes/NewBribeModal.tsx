import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  VStack,
  Button,
  Flex,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { CardHeader } from 'app/components/CardHeader';
import { IconButton, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BRIBE } from 'constants/icons';
import NewTokenAmountPanel from 'app/components/NewTokenAmountPanel/NewTokenAmountPanel';
import { useTokenAmountPanel } from './hooks/useTokenAmountPanel';
import { IBribeFarm } from 'app/interfaces/BribeFarm';
import { FarmsDropdown } from './FarmsDropdown';
import { Token } from '@lifi/sdk';
import { useBribe } from '../Voting/hooks/useBribe';
import { tokens, TOKEN_EMPTY } from 'constants/index';
import { checkAddress } from 'app/utils';
import { ethers } from 'ethers';
import useWallets from 'app/hooks/useWallets';
import useLogin from 'app/connectors/EthersConnector/login';

interface farmsProps {
  farmAddress: string;
  bribeAddress: string;
  rewardsTokens: string[];
}

export const NewBribeModal = ({
  farms,
  isOpen,
  farmType,
  onOpen: onOpenModal,
  onClose: onCloseModal,
  onSubmit,
  ...props
}) => {
  const translationRoot = `inSpirit.voting.bribes`;
  const { t } = useTranslation();
  const { createNewBribe } = useBribe();
  const { account } = useWallets();
  const { handleLogin } = useLogin();
  const [selectedFarmLpAddress, setSelectedFarmLpAddress] =
    useState<string>('');
  const [selectedBribe, setSelectedBribe] = useState<string>('');
  const [inputToken, setInputToken] = useState<Token>();
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [rewardTokens, setRewardTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [isAbleToCreate, setIsAbleToCreate] = useState<boolean>(false);
  const handleSelectInput = (token: Token, onClose: () => void) => {
    setInputToken(token);
    onClose();
  };
  const handleInputValue = ({ value, tokenSymbol }) => {
    setInputValue(value);
  };

  const handleFarmChange = (lpAddress: string) => {
    const ffarm = getFarm(lpAddress);
    console.log(ffarm);
    if (ffarm) {
      const { rewardTokens, bribe } = ffarm;
      console.log(rewardTokens);
      const farmRewards: Token[] = rewardTokens.map(rwToken =>
        getToken(rwToken),
      );
      console.log(farmRewards);
      setInputToken(farmRewards[0]);
      setRewardTokens(farmRewards);
      setSelectedBribe(bribe);
    }

    setSelectedFarmLpAddress(lpAddress);
  };

  const getToken = (address: string) => {
    const findedToken = tokens.find(token =>
      checkAddress(token.address, address),
    );
    if (findedToken) return findedToken;
    return TOKEN_EMPTY;
  };
  const getFarm = (address: string) => {
    console.log(address);
    const findedFarm = farms.find(farm => {
      return checkAddress(farm.plugin, address);
    });
    return findedFarm || null;
  };

  const { ongoingBribeAmount, minBribeAmount } = useTokenAmountPanel({
    selectedFarmLpAddress,
    selectedBribe,
    selectedToken: inputToken,
  });

  useEffect(() => {
    if (!selectedFarmLpAddress) {
      const { plugin, bribe, rewardTokens } = farms[0];
      if (farms[0]) {
        setSelectedFarmLpAddress(plugin);
        setSelectedBribe(bribe);
        const initialRewards: Token[] = rewardTokens.map(rwToken =>
          getToken(rwToken),
        );

        setInputToken(initialRewards[0]);
        setRewardTokens(initialRewards);
      }
    }
    if (inputToken && inputValue) {
      const BRIBE_MAX = '604800';
      const decimals = inputToken?.decimals || 18;
      const parsedValue = ethers.utils.parseUnits(inputValue, decimals);
      const isBigger =
        parsedValue.gt(BRIBE_MAX) && parsedValue.gte(ongoingBribeAmount);
      setIsAbleToCreate(isBigger);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farms, selectedFarmLpAddress, inputValue, inputToken]);

  const onCloseModalHandler = () => {
    onCloseModal();
    setIsLoading(false);
  };

  const onConfirm = async () => {
    if (!inputToken) {
      return;
    }
    setIsLoading(true);

    const bribeFarm: IBribeFarm = {
      bribeAddress: selectedBribe,
      token: inputToken,
      tokenValue: inputValue,
    };

    try {
      await createNewBribe(bribeFarm);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }

    onCloseModalHandler();
  };

  const getDisabled = () => {
    const IS_DISABLED = true;
    const NOT_DISABLED = false;
    if (isLoading) return IS_DISABLED;
    if (isAbleToCreate) return NOT_DISABLED;
    return IS_DISABLED;
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseModalHandler} {...props} isCentered>
      <ModalOverlay />
      <ModalContent
        backgroundColor="rgba(29.49, 26.39, 89.25, 0.90)"
        maxW={'450px'}
      >
        <Flex
          p={'spacing06'}
          pl={'spacing05'}
          alignItems="center"
          justifyContent="center"
        >
          <CardHeader
            title={t(`${translationRoot}.newBribe`)}
            id={BRIBE}
            helperContent={{
              title: 'New Bribe',
              text: 'Want more inSPIRIT votes for your farm? Select an existing farm to create a bribe for. This will incentivize more people to vote for your farm. More emissions!',
              showDocs: false,
            }}
            onIconClick={() => {}}
          />
          {/* <IconButton
            size="xs"
            height="2rem"
            width="2rem"
            bg="grayBorderBox"
            border="0"
            aria-label={t(`${translationRoot}.close`)}
            _active={{
              border: 'none',
            }}
            icon={<CloseIcon />}
            onClick={onCloseModal}
          /> */}
        </Flex>

        <VStack>
          <Flex direction="column" px="spacing06" gap="spacing04" w="100%">
            <Text color="#5F97FF" w="100%" textAlign="center">
              {t(`${translationRoot}.selectFarmToBribe`)}
            </Text>
            {farms && (
              <FarmsDropdown
                value={selectedFarmLpAddress}
                farms={farms}
                onChange={handleFarmChange}
              />
            )}

            {inputToken ? (
              <>
                <Text color="#5F97FF" textAlign="center" w="100%">
                  {t(`${translationRoot}.selectTokenAndAmount`)}
                </Text>
                <NewTokenAmountPanel
                  tokens={rewardTokens}
                  token={inputToken}
                  notShowCommonBase={true}
                  context="token"
                  inputValue={inputValue}
                  onSelect={handleSelectInput}
                  onChange={handleInputValue}
                  showPercentage
                  inputWidth="15rem"
                />
                <Text color="#A19ED3" w="100%">
                  {`Minimum bribe amount: ${minBribeAmount} ${inputToken.symbol}`}
                </Text>
              </>
            ) : null}

            <Flex
              pt="spacing02"
              pb="spacing06"
              justifyContent={'space-between'}
            >
              <Button
                padding="9px 51px"
                backgroundColor="#2E2A8C"
                onClick={onCloseModalHandler}
              >
                {t(`${translationRoot}.cancel`)}
              </Button>
              {!account ? (
                <Button onClick={() => handleLogin()}>Connect Wallet</Button>
              ) : (
                <Button
                  disabled={getDisabled()}
                  backgroundColor="#1D1A59"
                  borderColor="#22ABAC"
                  borderWidth="2px"
                  padding="9px 51px"
                  isLoading={isLoading}
                  onClick={onConfirm}
                >
                  {isLoading ? 'Loading...' : 'Confirm'}
                </Button>
              )}
            </Flex>
          </Flex>
        </VStack>
      </ModalContent>
    </Modal>
  );
};
