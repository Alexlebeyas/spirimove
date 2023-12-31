import { useState, useRef } from 'react';
import { PageContainer, ProfileImage } from '@/components';
import useUserStore from '@/stores/useUserStore';
import UserService from '@/services/UserService';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { InputLabel } from '@mui/material';
import { getCurrentLanguage, setCurrentLanguage, LANGUAGES } from '@/utils/languages';

const getLanguageOrder = (currentLanguage: string) => {
  return currentLanguage === LANGUAGES.FR.name
      ? [LANGUAGES.FR, LANGUAGES.EN]
      : [LANGUAGES.EN, LANGUAGES.FR];
};

const Profile = () => {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const refreshUser = useUserStore((state) => state.refreshUser);

  const [language, setLanguage] = useState(getCurrentLanguage());
  const [preferredLanguage, secondaryLanguage] = getLanguageOrder(language);


  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const onFileSelectHandler = () => {
    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current.click();
    }
  };

  const onFileDeleteHandler = async () => {
    await UserService.deleteProfileImage();
    await refreshUser();
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

  const getOfficeLabel = (office: string) => {
    const translatedOffice = t(`Office.${office}`);
    return translatedOffice !== `Office.${office}` ? translatedOffice : office;
  };
 
  return (
    <PageContainer>
      <div className="flex justify-center rounded-md bg-white p-4 shadow-md">
        <div>
          <div className="mb-6 flex flex-col items-center justify-center text-darkblue-800">
            <div className="relative mb-3">
              <ProfileImage name={user.display_name} size={160} fontSize={60} image={user.profile_picture} />
              <button
                className="absolute right-3 top-1 rounded-full bg-gray-100 p-1 shadow-md hover:bg-gray-200"
                onClick={onFileSelectHandler}
              >
                <EditIcon />
              </button>
              {user.profile_picture && (
                <button
                  className="absolute bottom-1 right-3 rounded-full bg-gray-100 p-1 shadow-md hover:bg-gray-200"
                  onClick={onFileDeleteHandler}
                >
                  <DeleteIcon style={{ color: '#E0303B' }} />
                </button>
              )}
            </div>
            <h3 className="mt-2">{user.display_name}</h3>
            <h4 className="mt-2 font-medium text-slate-500">
              {t('Common.Office')} {getOfficeLabel(user.office)}
            </h4>
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
              <Select labelId="language-select-label" value={language} label={t('Common.Language')} onChange={onLanguageChange}>
              <MenuItem value={preferredLanguage.name}>{t(`Common.${preferredLanguage.key}`)}</MenuItem>
              <MenuItem value={secondaryLanguage.name}>{t(`Common.${secondaryLanguage.key}`)}</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div></div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
