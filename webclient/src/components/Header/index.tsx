import logo from '@/assets/images/logo.png';
import { Disclosure } from '@headlessui/react';
import ProfileDropdownMenu from '@/components/ProfileDropdownMenu';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';

const navigation = [
  { name: 'Feed', to: '/' },
  { name: 'Leaderboard', to: '/leaderboard' },
  { name: 'About', to: '/about' },
  { name: 'My Spiri-Move', to: '/my-spiri-move' },
];

export const Header = () => {
  const isAuth = useIsAuthenticated();
  const location = useLocation();
  return (
    <Disclosure as="nav" className="fixed left-0 top-0 w-full bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto w-[90%]">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                {isAuth && (
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? <CloseIcon /> : <MenuIcon />}
                  </Disclosure.Button>
                )}
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-4">
                    <div className="mr-6 w-[100px]">
                      <img src={logo} alt="" />
                    </div>
                    {isAuth &&
                      navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          className={`rounded-md px-3 py-2 text-sm font-medium ${
                            location.pathname === item.to
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.to}
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    location.pathname === item.to
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  aria-current={location.pathname === item.to ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
