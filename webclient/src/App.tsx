import { useEffect, useState } from 'react';
import { Header, AppContainer, AppLoading } from '@/components';
import Router from '@/Router';
import useContestStore from '@/stores/useContestStore';
import useUserStore from '@/stores/useUserStore';

import '@/i18n/i18n';
import { useIsAuthenticated } from '@azure/msal-react';
import useParticipationStore from '@/stores/useParticipationStore';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const isAuth = useIsAuthenticated();

  const fetchConstest = useContestStore((state) => state.fetchConstest);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const fetchParticipations = useParticipationStore((state) => state.fetchParticipations);

  useEffect(() => {
    const initStore = async () => {
      await fetchConstest();
      await fetchUser();
      await fetchParticipations();
      setIsLoading(false);
    };

    initStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

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

// use the loader function for react router
