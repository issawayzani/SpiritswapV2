import { useTranslation } from 'react-i18next';
import { Modal } from 'app/components/Modal';
import { Button, Flex } from '@chakra-ui/react';
import { Props } from './SettingsModal.d';
import { BodyContainer, Label } from './styles';
import { openInNewTab } from 'app/utils/redirectTab';
import { Switch } from 'app/components/Switch';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectUserSettings } from 'store/settings/selectors';
import { setUserNotifications, setUserSuggestions } from 'store/settings';
import ODNP from '@open-defi-notification-protocol/widget';
import useWallets from 'app/hooks/useWallets';

const SettingsModal = ({
  selectedLanguageId,
  onClose,
  onSelectLanguage,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const translationPath = 'common.settingsModal';
  const buttonTranslationPath = 'common.topBar';
  const dispatch = useAppDispatch();
  const { notifications, suggestions } = useAppSelector(selectUserSettings);
  const { account } = useWallets();
  const handleToggleSuggestions = toggle => {
    dispatch(
      setUserSuggestions({
        suggestions: toggle,
      }),
    );
  };

  const handleToggleNotifications = toggle => {
    dispatch(setUserNotifications({ notifications: toggle }));
  };

  const handleOpenModal = () => {
    const odnp = new ODNP();
    odnp.init();
    odnp.show(account, 'spiritswap');
  };

  // const selectedLanguage = 'en';
  // const selectedLanguageObject = LanguageItems.find(
  //   item => item.id === selectedLanguage,
  // );

  return (
    <Modal title={t(`${translationPath}.title`)} onClose={onClose} {...props}>
      <BodyContainer>
        <span className="settings-text">
          <i className="fa fa-question-circle-o margin"></i>Lorem ipsum dolor
          sit amet.
        </span>
        <span className="permissions-title">Token approval permissions</span>
        <div className="button-margin-bottom">
          <div className="float-left button-margin-right">
            <Button className="setting-button" bg="transparent" border={'none'}>
              One time approval
            </Button>
          </div>
          <div className="float-left">
            <Button className="setting-button" bg="transparent" border={'none'}>
              Unlimited approval
            </Button>
          </div>
        </div>
        <span className="permissions-title">Transaction Settings</span>
        <span className="subtitle-settings">Slippage Tolerance</span>
        <div className="button-margin-bottom">
          <div className="float-left button-margin-right">
            <Button
              className="setting-button tolerance-width"
              bg="transparent"
              border={'none'}
            >
              0.1%
            </Button>
          </div>
          <div className="float-left button-margin-right">
            <Button
              className="setting-button tolerance-width"
              bg="transparent"
              border={'none'}
            >
              0.5%
            </Button>
          </div>
          <div className="float-left button-margin-right">
            <Button
              className="setting-button tolerance-width"
              bg="transparent"
              border={'none'}
            >
              1%
            </Button>
          </div>
          <div className="float-left button-margin-right">
            <Button
              className="setting-button tolerance-width"
              bg="transparent"
              border={'none'}
            >
              Auto%
            </Button>
          </div>
          <div className="float-left">
            <Button
              className="setting-button tolerance-width"
              bg="transparent"
              border={'none'}
            >
              Custom
            </Button>
          </div>
        </div>
        <span className="subtitle-settings">Transaction Speed(GWEI)</span>
        <div className="button-margin-bottom">
          <div className="float-left button-margin-right">
            <Button className="setting-button" bg="transparent" border={'none'}>
              Standard
            </Button>
          </div>
          <div className="float-left button-margin-right">
            <Button className="setting-button" bg="transparent" border={'none'}>
              Fast 164
            </Button>
          </div>
          <div className="float-left">
            <Button className="setting-button" bg="transparent" border={'none'}>
              Rapid 236
            </Button>
          </div>
        </div>
        <Button bg="transparent" border={'none'}>
          Reset
        </Button>
        <Button bg="transparent" border={'none'}>
          Confirm
        </Button>
        {/* <Flex w="full" justify="space-between" align="center">
          <Label>{t(`${translationPath}.notifications`)}</Label>
          <Switch
            checked={notifications}
            onChange={() => handleToggleNotifications(!notifications)}
          />
        </Flex>
        <Flex w="full" justify="space-between" align="center">
          <Label>{t(`${translationPath}.pushNotifications`)}</Label>
          <Button onClick={handleOpenModal} bg="secondary" border={'none'}>
            Set up
          </Button>
        </Flex>
        <Flex w="full" justify="space-between" align="center">
          <Label>Suggestions</Label>
          <Switch
            checked={suggestions}
            onChange={() => handleToggleSuggestions(!suggestions)}
          />
        </Flex>
        <Button
          w="full"
          bg="grayBorderBox"
          h="28px"
          mt="spacing03"
          border="none"
          onClick={() => openInNewTab('https://app.spiritswap.finance/#/')}
        >
          {t(`${buttonTranslationPath}.switchV1`)}
        </Button> */}
      </BodyContainer>
    </Modal>
  );
};

export default SettingsModal;
