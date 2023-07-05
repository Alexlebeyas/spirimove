import { useEffect } from 'react';
import { InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';

interface Props {
  children: JSX.Element;
}

export const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated && inProgress === InteractionStatus.None) {
      instance.loginRedirect();
    }
  }, [isAuthenticated, inProgress, instance]);

  return children;
};
