import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";

export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => {
        console.log(e);
    });
  }
  return (
      <div onClick={() => handleLogin()}>Sign in</div>
  )
}
