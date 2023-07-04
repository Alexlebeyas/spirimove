import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { ProfileImage } from '@/components';
import useUserStore from '@/stores/useUserStore';
import { useTranslation } from 'react-i18next';
import { useMsal } from '@azure/msal-react';

export const ProfileDropdownMenu = () => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);

  const { instance } = useMsal();

  const onLogoutHandler = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: '/logout' });
  };

  return (
    <>
      <Menu as="div" className="relative">
        <div>
          <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="sr-only">Open user menu</span>
            <ProfileImage name={user.display_name} image={user.profile_picture} size={45} fontSize={18} />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <Link to="/profile" className={`${active && 'bg-gray-100'} block px-4 py-2 text-sm text-gray-700`}>
                  {t('Header.MyProfile')}
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onLogoutHandler}
                  className={`${
                    active && 'bg-gray-100'
                  }  w-full px-4 py-2 text-left text-sm text-gray-700 hover:cursor-pointer`}
                >
                  {t('Header.Logout')}
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
