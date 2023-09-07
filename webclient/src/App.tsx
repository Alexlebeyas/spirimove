import Router from '@/Router';
import { AppContainer, AppLoading, Header } from '@/components';
import useUserStore from '@/stores/useUserStore';
import { useEffect, useState } from 'react';

import '@/i18n/i18n';

import { InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useUserStore((state) => state.fetchUser);

  const { inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    const initStores = async () => {
      await fetchUser();
      setIsLoading(false);
    };

    if (isAuthenticated && inProgress === InteractionStatus.None) {
      initStores();
      return;
    }

    if (!isAuthenticated && inProgress === InteractionStatus.None) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, inProgress]);

  return (
    <>
      <Header />
      <ToastContainer />
      <AppContainer>
        <Router />
      </AppContainer>
      {isLoading && <AppLoading />}
    </>
  );
};

export default App;
