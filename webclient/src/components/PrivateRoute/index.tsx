import { useNavigate } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';

// TODO Add roles verification later;

interface Props {
  children: JSX.Element;
}

export const PrivateRoute: React.FC<Props> = ({ children }) => {
  const isAuth = useIsAuthenticated();
  const navigate = useNavigate();

  if (!isAuth) {
    navigate('/login');
  }

  return children;
};
