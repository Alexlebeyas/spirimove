import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";

const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => {
      console.log(e);
    });
  }
  return (
    <button
      type="button"
      className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
      onClick={handleLogin}
    >
      Sign In
    </button>
  )
}

export default SignInButton;