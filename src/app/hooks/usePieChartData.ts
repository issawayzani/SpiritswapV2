import { BribeCard } from 'app/interfaces/Inspirit';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const colorChannelMixer = (
  colorChannelA: number,
  colorChannelB: number,
  amountToMix: number,
) => {
  const channelA = colorChannelA * amountToMix;
  const channelB = colorChannelB * (1 - amountToMix);
  return channelA + channelB;
};
const colorMixer = (rgbA, rgbB, amountToMix, symbol) => {
  const colorA = rgbA ? rgbA : '#4640D3';
  const colorB = rgbB ? rgbB : '#8D89D3';
  const customAmount = symbol === 'WFTM' ? 2 : amountToMix;
  const r = colorChannelMixer(colorA[0], colorB[0], customAmount);
  const g = colorChannelMixer(colorA[1], colorB[1], customAmount);
  const b = colorChannelMixer(colorA[2], colorB[2], customAmount);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

const TOKENS_COLORS = {
  USDC: '#4640D3',
  SPIRIT: '#8D89D3',
  fUSDT: '#167F8B',
  MIM: '#5F97FF',
  DAI: '#C04AFF',
  FRAX: '#2E2A8C',
  miMATIC: [251, 231, 185],
  WFTM: [255, 215, 0],
  BTC: [80, 231, 185],
  ETH: [251, 80, 185],
  LQDR: [75, 10, 230],
  BIFI: [123, 104, 238],
  SUSHI: [76, 0, 19],
  DEUS: [255, 99, 71],
};

const pieChartOptions = {
  plugins: {
    legend: {
      display: false,
    },
    autocolors: {
      mode: 'data',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = `${context.label}: `;
          const value = `${context.parsed}%`;
          return `${label}${value}`;
        },
      },
    },
  },
};

const usePieChartData = ({ farmsList }: { farmsList: BribeCard[] }) => {
  const { t } = useTranslation();
  const translationPath = 'inSpirit.voting';

  const pieChartData = useMemo(() => {
    const data: number[] = [];
    const labels: string[] = [];
    const othersVotes = {
      name: t(`${translationPath}.others`),
      value: 0,
      color: '#C04AFF',
    };
    for (let i = 0; i < farmsList.length; i++) {
      const { symbol, votePercent, isAlive } = farmsList[i];
      if (!isAlive) continue;
      const value = +`${(Number(votePercent) / 1e18).toFixed(2)}`.replace(
        '%',
        '',
      );
      console.log(value);
      // const lpSymbol = `${symbol.replace(' ', '-')} LP`;
      if (value > 1) {
        data.push(value);
        labels.push(symbol);
      } else {
        othersVotes.value = othersVotes.value + value;
      }
    }

    return {
      labels,
      datasets: [
        {
          data,

          borderColor: ['none'],
          borderWidth: 0,
          hoverBorderWidth: 0,
          hoverBorderColor: ['none'],
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmsList]);

  return {
    pieChartData,
    pieChartOptions,
  };
};

export default usePieChartData;
