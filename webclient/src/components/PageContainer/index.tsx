import { useLocation } from 'react-router-dom';

interface Props {
  children: JSX.Element | Array<JSX.Element>;
}

export const PageContainer: React.FC<Props> = ({ children }) => {
  const location = useLocation();

  if (location.pathname === '/' || location.pathname === '/profile') {
    return <div className="mx-auto w-[90%] md:w-[500px]">{children}</div>;
  }

  return <div className="mx-auto w-[90%] md:w-[80%]">{children}</div>;
};
