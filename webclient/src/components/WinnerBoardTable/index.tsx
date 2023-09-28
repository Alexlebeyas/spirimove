import { useTranslation } from 'react-i18next';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';

import { ProfileImage } from '..';
import { WinnerInfo, WinnerboardEntries, IContest } from '@/interfaces';

interface WinnersListProps {
  winners?: WinnerInfo[];
}

interface WinnerDetailsProps extends WinnerInfo {
  idx: number;
}

interface WinnerPodiumProps {
  contest?: IContest;
  results?: WinnerboardEntries[];
}

const WinnerDetails: React.FC<WinnerDetailsProps> = ({ name, idx, profile_picture, office, price }) => {
  const { t } = useTranslation();
  const className = `flex items-center px-1 py-3 sm:px-3`;

  return (
    <div id={name} className={className}>
      <div className="mr-3 flex-none text-sm text-slate-600 sm:mr-4">{idx + 1}</div>
      <div className="flex flex-grow items-center">
        <div className="mr-3">
          <ProfileImage name={name} image={profile_picture} size={32} fontSize={14} />
        </div>
        <div>
          <div className="text-[15px] font-medium text-darkblue-800 sm:text-sm">{name}</div>
          <div className="text-[13px] font-medium text-slate-500 sm:text-xs">{office}</div>
        </div>
        <div className="ml-auto flex-none text-sm font-bold text-darkblue-800">
          {t('Leaderboard.PrizeDisplay', { nb: price })}
        </div>
      </div>
    </div>
  );
};

const WinnersList: React.FC<WinnersListProps> = ({ winners }) => {
  const { t } = useTranslation();
  if (!winners?.length) {
    return <p>{t('Leaderboard.WinnersNotFound')}</p>;
  }

  return (
    <div className="h-auto divide-y divide-slate-200 overflow-y-auto">
      {winners.map((winner, idx) => (
        <WinnerDetails key={`${winner.name}_${idx}`} idx={idx} {...winner} />
      ))}
    </div>
  );
};

export const WinnerPodium: React.FC<WinnerPodiumProps> = ({ contest, results }) => {
  const { t } = useTranslation();
  if (!contest?.is_open && contest?.show_winners && results) {
    return (
      <div className="mb-5 flex flex-col antialiased lg:flex-row">
        <div className="mb-5 w-full lg:w-1/2">
          <div className="h-auto rounded-md bg-white px-4 py-5 shadow-md sm:px-5">
            <h3 className="mb-3 flex items-center text-xl font-bold text-darkblue-800 lg:text-lg">
              {t('Leaderboard.WinnersLabel')} <EmojiEventsOutlinedIcon className="ml-1" fontSize="medium" />
            </h3>
            <WinnersList winners={results[0]?.winners} />
          </div>
        </div>
        <div className="mb-5 w-full lg:ml-5 lg:w-1/2">
          <div className="h-auto rounded-md bg-white px-4 py-5 shadow-md sm:px-5">
            <h3 className="mb-3 text-xl font-bold text-darkblue-800 lg:text-lg">
              {t('Leaderboard.WinnersPerOfficeLabel')}
            </h3>
            <WinnersList winners={results[0]?.perOfficeWinners} />
          </div>
        </div>
      </div>
    );
  }

  return null;
};
