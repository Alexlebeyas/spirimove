import { useLocation } from 'react-router-dom';

interface Props {
  children: JSX.Element | Array<JSX.Element>;
}

export const PageContainer: React.FC<Props> = ({ children }) => {
  const location = useLocation();

  if (location.pathname === '/' || location.pathname === '/profile') {
    return <div className="mx-auto w-full px-4 md:w-[500px] md:px-0">{children}</div>;
  }

  if (location.pathname === '/leaderboard') {
    return <div className="mx-auto w-full md:w-[85%] lg:w-[800px]">{children}</div>;
  }

  return <div className="mx-auto w-[90%] md:w-[80%]">{children}</div>;
};
