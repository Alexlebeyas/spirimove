import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "@/components/SignInButton";

const Home = () => {

  const isCO = useIsAuthenticated();

  if (isCO) return (
    <div className="flex h-screen items-center justify-center bg-[#e0303b]">
      <h1>Spiri Move App</h1>
      <h2>{ "Welcome ! you are connected" }</h2>
    </div>
  );

  return (
    <div className="flex h-screen items-center justify-center bg-[#e0303b]">
      <h1>Spiri Move App</h1>
      <SignInButton/>
    </div>
  );
};

export default Home;
