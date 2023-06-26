import { Header, AppContainer } from '@/components';
import Router from '@/Router';

import '@/i18n/i18n';

const App = () => {
  return (
    <>
      <Header />
      <AppContainer>
        <Router />
      </AppContainer>
    </>
  );
};

export default App;
