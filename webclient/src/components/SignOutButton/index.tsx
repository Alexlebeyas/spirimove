import { useMsal } from '@azure/msal-react';

const SignOutButton = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: '/logout' });
  };

  return <div onClick={handleLogout}>Sign Out</div>;
};

export default SignOutButton;
