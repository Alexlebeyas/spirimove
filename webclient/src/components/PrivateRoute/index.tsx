import { useEffect } from 'react';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';

interface Props {
  children: JSX.Element;
}

export const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated && inProgress === InteractionStatus.None) {
      const redirectOpts: RedirectRequest = { scopes: ['User.Read']};
      instance.loginRedirect(redirectOpts);
    }
  }, [isAuthenticated, inProgress, instance]);

  return children;
};
