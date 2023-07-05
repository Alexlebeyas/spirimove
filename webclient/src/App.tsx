import { useEffect, useState } from 'react';
import { Header, AppContainer, AppLoading } from '@/components';
import Router from '@/Router';
import useContestStore from '@/stores/useContestStore';
import useUserStore from '@/stores/useUserStore';

import '@/i18n/i18n';
import useParticipationStore from '@/stores/useParticipationStore';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchConstest = useContestStore((state) => state.fetchConstest);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const fetchParticipations = useParticipationStore((state) => state.fetchParticipations);

  const { inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    const initStores = async () => {
      await fetchConstest();
      await fetchUser();
      await fetchParticipations();
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
      <AppContainer>
        <Router />
      </AppContainer>
      {isLoading && <AppLoading />}
    </>
  );
};

export default App;
