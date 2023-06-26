import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const isAuth = useIsAuthenticated();

  useEffect(() => {
    if (isAuth) {
      navigate('/', { replace: true });
      return;
    }

    instance.loginRedirect();
  }, [instance, isAuth, navigate]);

  return <></>;
};

export default Login;
