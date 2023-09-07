import logo from '@/assets/images/logo.svg';
import { Disclosure } from '@headlessui/react';
import { ProfileDropdownMenu } from '@/components';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const { t } = useTranslation();

  const isAuth = useIsAuthenticated();
  const location = useLocation();

  const navigation = [
    { name: t('Header.Feed'), to: '/' },
    { name: t('Header.Leaderboard'), to: '/leaderboard' },
    { name: t('Header.MySpiriMove'), to: '/my-spiri-move' },
    { name: t('Header.About'), to: 'https://spoc.spiria.com/display/fun/Spiri-Move', target: '_blank' },
  ];

  return (
    <Disclosure as="nav" className="fixed left-0 top-0 z-[999] w-full bg-darkblue-800">
      {({ open, close }) => (
        <>
          <div className="px-3 sm:mx-auto sm:w-[85%]">
            <div className="relative flex h-16 items-center justify-between sm:h-20">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                {isAuth && (
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-darkblue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? <CloseIcon /> : <MenuIcon />}
                  </Disclosure.Button>
                )}
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-4">
                    <div className="mr-8 w-[80px]">
                      <img src={logo} alt="" />
                    </div>
                    {isAuth &&
                      navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          target={item.target}
                          className={`rounded-md px-3 py-2 text-sm antialiased ${
                            location.pathname === item.to
                              ? 'bg-darkblue-600 font-bold text-yellow'
                              : 'font-medium text-lightgrey hover:bg-darkblue-800 hover:text-blue'
                          }`}
                          aria-current={location.pathname === item.to ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
              {isAuth && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <ProfileDropdownMenu />
                </div>
              )}
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="h-screen space-y-2 px-4 py-5">
              <div className="mb-8 ml-3 w-[100px]">
                <img src={logo} alt="" />
              </div>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  onClick={() => close()}
                  className={`block rounded-md px-3 py-2.5 text-lg antialiased ${
                    location.pathname === item.to
                      ? 'bg-darkblue-600 font-bold text-yellow'
                      : 'font-medium text-lightgrey hover:bg-gray-700 hover:text-white'
                  }`}
                  aria-current={location.pathname === item.to ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
