import { useMsal } from '@azure/msal-react';

const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect().catch((e) => {
      console.log(e);
    });
  };
  return (
    <button
      type="button"
      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
      onClick={handleLogin}
    >
      Sign In
    </button>
  );
};

export default SignInButton;
