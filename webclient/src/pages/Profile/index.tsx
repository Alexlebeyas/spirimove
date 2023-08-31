import { useState, useRef } from 'react';
import { PageContainer, ProfileImage } from '@/components';
import useUserStore from '@/stores/useUserStore';
import UserService from '@/services/UserService';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import EditIcon from '@mui/icons-material/Edit';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { InputLabel } from '@mui/material';
import { getCurrentLanguage, setCurrentLanguage, LANGUAGES } from '@/utils/languages';

const Profile = () => {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const refreshUser = useUserStore((state) => state.refreshUser);

  const [language, setLanguage] = useState(getCurrentLanguage());

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const onFileSelectHandler = () => {
    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current.click();
    }
  };

  const onFileChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    await UserService.updateProfileImage(files[0]);
    await refreshUser();
  };

  const onLanguageChange = (e: SelectChangeEvent) => {
    setLanguage(e.target.value);
    i18next.changeLanguage(e.target.value);
    setCurrentLanguage(e.target.value);
  };

  return (
    <PageContainer>
      <div className="flex justify-center rounded-md bg-white p-4 shadow-md">
        <div>
          <div className="mb-6 flex flex-col items-center justify-center">
            <div className="relative">
              <ProfileImage name={user.display_name} size={175} fontSize={70} image={user.profile_picture} />
              <button
                className="absolute right-5 top-1 rounded-full bg-gray-100 p-1 shadow-md hover:bg-gray-200"
                onClick={onFileSelectHandler}
              >
                <EditIcon />
              </button>
            </div>
            <h3 className="mt-2">{user.display_name}</h3>
            <h4 className="mt-2">{t('Common.Office')} {user.office}</h4>
            <input
              className="hidden"
              type="file"
              accept="image/png, image/gif, image/jpeg"
              ref={hiddenFileInput}
              onChange={onFileChangeHandler}
            />
            <br />
            <FormControl sx={{ m: 1, minWidth: 120, margin: 0 }} size="small">
              <InputLabel id="language-select-label">{t('Common.Language')}</InputLabel>
              <Select labelId="language-select-label" value={language} label="Language" onChange={onLanguageChange}>
                <MenuItem value={LANGUAGES.EN.name}>{t(`Common.${LANGUAGES.EN.key}`)}</MenuItem>
                <MenuItem value={LANGUAGES.FR.name}>{t(`Common.${LANGUAGES.FR.key}`)}</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
