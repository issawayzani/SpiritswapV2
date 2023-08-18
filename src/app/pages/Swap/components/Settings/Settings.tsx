import { TimerClockIcon } from 'app/assets/icons';
import {
  NumberInput,
  NumberInputField,
  InputLeftAddon,
  InputGroup,
  HStack,
  Text,
  Button,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
} from '@chakra-ui/react';
import { DEFAULT_DEADLINE } from 'utils/swap';
import { Switch } from 'app/components/Switch';
import TabSelect from 'app/components/TabSelect';
import TabSelectOld from 'app/components/TabSelectOld';
import TabSelectInput from '../TabSelectInput';
import { useTranslation } from 'react-i18next';
import { SLIPPAGE_ID, SLIPPAGE_TOLERANCES, SPEED_PRICES } from 'utils/swap';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { SettingsProps } from './Settings.d';
import { CardHeader } from 'app/components/CardHeader';
import { ARROWBACK } from 'constants/icons';
import { useState } from 'react';
import { BRIDGE_MODE, BRIDGE_MODE_ID, WARNSLIP } from 'constants/index';
import { colors } from 'theme/base/color';
import { borderRadius } from 'theme/base/borderRadius';

export default function Settings({
  isBridge,
  states,
  handlers,
  txGweiCost,
  toggleSettings,
}: SettingsProps) {
  const { t } = useTranslation();

  const { slippage, speedIndex, deadline, bridgeMode, approveMax } = states;

  const {
    handleSlippage,
    handleTxSpeed,
    handleDeadline,
    handleApproveMax,
    handleSpeedIndex,
    handleBridgeMode,
    handleResetAll,
  } = handlers;

  const [customInput, setCustomInput] = useState(() =>
    SLIPPAGE_TOLERANCES.includes(slippage) ? '' : slippage,
  );
  const handleCustomInput = customValue => {
    checkCustomValue(customValue);
    setCustomInput(customValue);
    if (customValue === 'Auto') handleSlippage(`${customValue}`);
    else handleSlippage(`${customValue}`);
  };

  const slippageIndex: number = SLIPPAGE_ID[slippage];

  const [warningMessage, setWarningMessage] = useState('');
  const translationsPath = 'swap.settings';

  const handleResetDefaults = () => {
    handleResetAll();

    localStorage.setItem(
      'settingsOptions',
      JSON.stringify({
        slippage: SLIPPAGE_TOLERANCES[1],
        speedIndex: 0,
        deadline: DEFAULT_DEADLINE,
        txSpeed: SPEED_PRICES.STANDARD,
        bridgeMode: BRIDGE_MODE.cheap,
        approveMax: true,
        showChart: false,
      }),
    );

    setCustomInput('');
  };

  const checkCustomValue = value => {
    const warnMessage =
      value >= WARNSLIP ? t(`${translationsPath}.warningMessage`) : '';
    setWarningMessage(warnMessage);
    handleSlippage(value);
  };

  const HeaderSection = () => (
    <HStack justifyContent="space-between">
      <HStack>
        <CardHeader
          id={ARROWBACK}
          hidebackground
          title={t(`${translationsPath}.title`)}
          showIcon={false}
          hideQuestionIcon={true}
          onIconClick={toggleSettings}
        />
      </HStack>
      <Button
        bg={colors.bgReset}
        border={'none'}
        borderRadius={borderRadius.mmd}
        className="reset-button"
        variant="iconButton"
        onClick={handleResetDefaults}
        fontWeight="medium"
      >
        {t(`${translationsPath}.reset`)}
      </Button>
    </HStack>
  );

  const slippageSection = () => (
    <>
      <HStack justifyContent="space-between" mt="17.5px" mb="4px">
        <Text className="subtitle-settings">
          {t(`${translationsPath}.slippageToleranceLabel`)}
          {/* <QuestionHelper
            title={t(`${translationsPath}.helperTitle`)}
            text={[
              t(`${translationsPath}.helperP1`),
              t(`${translationsPath}.helperP2`),
              t(`${translationsPath}.helperP3`),
              t(`${translationsPath}.helperP4`),
            ]}
            iconWidth="16px"
            iconMargin="0 0 0 8px"
          /> */}
        </Text>
        <Text className="subtitle-settings">
          {slippage === 'Auto' ? slippage : `${slippage}%`}
        </Text>
      </HStack>
      <TabSelectInput
        index={slippageIndex}
        customInput={customInput}
        handleCustomInput={handleCustomInput}
        warningSlip={WARNSLIP}
      />
    </>
  );

  const TrxSpeedSection = () => (
    <>
      <HStack justifyContent="space-between" mt="12px" mb="4px">
        <Text className="subtitle-settings">
          {t(`${translationsPath}.transactionSpeed`)} (GWEI)
          {/* <QuestionHelper
            title={t(`${translationsPath}.helperTitle`)}
            text={[
              t(`${translationsPath}.helperP1`),
              t(`${translationsPath}.helperP2`),
              t(`${translationsPath}.helperP3`),
              t(`${translationsPath}.helperP4`),
            ]}
            iconWidth="16px"
            iconMargin="0 0 0 8px"
          /> */}
        </Text>
        <Text className="subtitle-settings">{txGweiCost} (GWEI)</Text>
      </HStack>
      <TabSelectOld
        index={speedIndex}
        setIndex={handleSpeedIndex}
        names={Object.values(SPEED_PRICES)}
        w="full"
        mx="0"
        onSelect={handleTxSpeed}
      />
    </>
  );

  const DeadLineSection = () => (
    <HStack justifyContent="space-between" mt="12px">
      <Text className="subtitle-settings">
        {t(`${translationsPath}.transactionDeadlineLabel`)}
        {/* <QuestionHelper
          title={t(`${translationsPath}.helperTitle`)}
          text={[
            t(`${translationsPath}.helperP1`),
            t(`${translationsPath}.helperP2`),
            t(`${translationsPath}.helperP3`),
            t(`${translationsPath}.helperP4`),
          ]}
          iconWidth="16px"
          iconMargin="0 0 0 8px"
        /> */}
      </Text>
      <HStack w="90px">
        <InputGroup className="timer-button">
          <InputLeftAddon ps="8px" pe="10px">
            <TimerClockIcon color="#f3f2ff" width="24px" />
          </InputLeftAddon>
          <NumberInput
            step={1}
            precision={0}
            value={deadline}
            onChange={(x, value) => {
              handleDeadline(value);
            }}
            max={60}
            min={6}
            bgColor="transparent"
            borderColor="none"
            variant="noBorder"
            defaultValue={10}
          >
            <NumberInputField
              ps="0"
              pe="10px"
              w="100%"
              color="#F3F2FF"
              fontSize="sm"
              borderColor="none"
              className="timer-input"
              bgColor="transparent"
            />
            <NumberInputStepper border="none">
              <NumberIncrementStepper border="none" />
              <NumberDecrementStepper border="none" />
            </NumberInputStepper>
          </NumberInput>
        </InputGroup>
      </HStack>
    </HStack>
  );

  const BridgeModeSection = () => (
    <>
      <HStack justifyContent="space-between" mt="17.5px" mb="4px">
        <Text className="subtitle-settings">
          Bridge Mode
          {/* <QuestionHelper
            title={t(`${translationsPath}.helperTitle`)}
            text={[
              t(`${translationsPath}.helperP1`),
              t(`${translationsPath}.helperP2`),
              t(`${translationsPath}.helperP3`),
              t(`${translationsPath}.helperP4`),
            ]}
            iconWidth="16px"
            iconMargin="0 0 0 8px"
          /> */}
        </Text>
      </HStack>
      <TabSelectOld
        index={BRIDGE_MODE_ID[bridgeMode || 0]}
        setIndex={() => {}}
        names={Object.values(BRIDGE_MODE)}
        w="full"
        onSelect={handleBridgeMode}
      />{' '}
    </>
  );

  const ApproveMaxSection = () => (
    <HStack justifyContent="space-between" mt="12px">
      <Text className="subtitle-settings">
        {t(`${translationsPath}.approveMaxLabel`)}
        {/* <QuestionHelper
          title={t(`${translationsPath}.helperTitle`)}
          text={[
            t(`${translationsPath}.helperP1`),
            t(`${translationsPath}.helperP2`),
            t(`${translationsPath}.helperP3`),
            t(`${translationsPath}.helperP4`),
          ]}
          iconWidth="16px"
          iconMargin="0 0 0 8px"
        /> */}
      </Text>
      <HStack>
        <Switch
          checked={approveMax}
          onChange={() =>
            handleApproveMax ? handleApproveMax(!approveMax) : null
          }
        />
      </HStack>
    </HStack>
  );

  return (
    <>
      <Flex align="stretch" direction="column" className="swap-settings">
        {HeaderSection()}
        {slippageSection()}

        {warningMessage && (
          <Text
            color="yellow.500"
            mt="spacing03"
            fontSize="sm"
            fontWeight="medium"
          >
            {t(warningMessage)}
          </Text>
        )}

        {!isBridge ? TrxSpeedSection() : null}
        {!isBridge ? DeadLineSection() : null}
        {!isBridge ? ApproveMaxSection() : null}
        {isBridge ? BridgeModeSection() : null}
      </Flex>
    </>
  );
}
