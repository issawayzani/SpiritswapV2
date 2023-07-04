import { render } from '@testing-library/react';
import Homeold from 'app/pages/Homeold/Homeold';
import { store } from 'store';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { mockUseTranslation } from 'mocks/i18nForTests';

import ThemeProvider from 'theme';
import { ChakraThemeProvider } from 'theme/chakra';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe('<Homeold />', () => {
  const props = {};
  const renderComonent = props =>
    render(
      <ChakraThemeProvider>
        <ThemeProvider>
          <HelmetProvider>
            <Provider store={store}>
              <Homeold {...props} />
            </Provider>
          </HelmetProvider>
        </ThemeProvider>
      </ChakraThemeProvider>,
    );

  xit('should render and match snapshot', () => {
    const component = renderComonent(props);
    expect(component).toMatchSnapshot();
  });
});
