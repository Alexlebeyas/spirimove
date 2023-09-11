import { ProfileImage } from '@/components';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { FacebookSelector, FacebookCounter } from '@charkour/react-reactions';
import ParticipationService from '@/services/ParticipationService';
import { IParticipation } from '@/interfaces';
import { fetchAllParticipations } from '@/stores/useParticipationStore';

interface Props {
  participation: IParticipation;
}

interface ReactionsEmoji {
  emoji: string;
  by: string;
}

export const ParticipationCard: React.FC<Props> = ({ participation }) => {
  const { t } = useTranslation();
  const updateAllParticipations = fetchAllParticipations((state) => state.getParticipations);

  const onEmojiClick2 = (key: string) => {
    ParticipationService.toggleReactionParticipation({ participation: participation.id, reaction: key }).then(() => {
      updateAllParticipations();
    });
  };

  const renderCreationTime = () => {
    const diff = DateTime.now()
      .diff(DateTime.fromISO(participation.date_created), ['day', 'hour', 'minute', 'second'])
      .toObject();

    if (diff.days !== 0) {
      return `${diff.days}${t('Time.DayShortName')}`;
    }

    if (diff.hours !== 0) {
      return `${diff.hours}h`;
    }

    if (diff.minutes !== 0) {
      return `${diff.minutes}m`;
    }

    return `${diff.seconds?.toFixed()}s`;
  };

  const reactionsCounters: ReactionsEmoji[] = [];
  participation.reactions.forEach((reaction) => {
    reactionsCounters.push({ emoji: reaction.reaction, by: reaction.user__display_name });
  });

  return (
    <div className="mb-6 w-full overflow-hidden rounded-md bg-white shadow-md">
      <div className="p-3">
        <div className="flex items-center">
          <div className="mr-2">
            <ProfileImage
              name={participation.user.display_name}
              image={participation.user.profile_picture}
              size={45}
              fontSize={18}
            />
          </div>
          <div>
            <div className=" text-base font-semibold">{participation.user.display_name}</div>
            <div className="text-xs font-medium leading-[14px] text-gray-700">{renderCreationTime()}</div>
          </div>
        </div>
      </div>
      <img className="max-h-[450px] w-full object-contain" src={participation.image} />
      <div className="bg-white p-3">
        <div className="mb-1 text-sm font-semibold">{participation.date}</div>
        <p>{participation.description}</p>
      </div>
      <FacebookCounter counters={reactionsCounters} />
      <FacebookSelector onSelect={onEmojiClick2} reactions={['like', 'love', 'haha', 'wow', 'sad', 'angry']} />
    </div>
  );
};
