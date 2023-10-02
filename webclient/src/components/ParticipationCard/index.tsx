import React, { useMemo, useState } from 'react';
import { ProfileImage } from '@/components';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { ReactionBarSelector, ReactionCounter, ReactionCounterObject } from '@charkour/react-reactions';
import ParticipationService from '@/services/ParticipationService';
import { IParticipation } from '@/interfaces';
import { fetchAllParticipations } from '@/stores/useParticipationStore';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import { formatDate } from '@/utils/dates';
import './index.css';

interface Props {
  participation: IParticipation;
}

interface EmojiProps {
  label: string;
  node: JSX.Element;
  key: string;
}

export const ParticipationCard: React.FC<Props> = ({ participation }) => {
  const { t } = useTranslation();
  const updateAllParticipations = fetchAllParticipations((state) => state.getParticipations);
  const emojis: EmojiProps[] = useMemo(() => [
    { label: t('Emojis.like'), node: <span>👍</span>, key: 'like' },
    { label: t('Emojis.love'), node: <span>💖</span>, key: 'love' },
    { label: t('Emojis.haha'), node: <span>😆</span>, key: 'haha' },
    { label: t('Emojis.wow'), node: <span>😱</span>, key: 'wow' },
    { label: t('Emojis.bravo'), node: <span>🙌</span>, key: 'bravo' },
    { label: t('Emojis.muscle'), node: <span>💪</span>, key: 'muscle' },
  ], [t]);

  const reactionsCounters: ReactionCounterObject[] = useMemo(() => {
    return participation.reactions
      .map((reaction) => {
        const emojiNode = emojis.find((emoji) => reaction.reaction === emoji.key)?.node || <span>👻</span>;
        return {
          label: reaction.reaction,
          node: emojiNode,
          by: reaction.user__display_name,
        };
      })
      .filter(Boolean);
  }, [participation.reactions, emojis]);

  const onEmojiClick = (key: string) => {
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
  const [emojiSelector, setEmojiSelector] = useState(false);

  return (
    <div className="mb-6 w-full overflow-hidden rounded-md bg-white text-darkblue-800 antialiased shadow-md">
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
            <div className="text-xs font-medium leading-[14px] text-slate-600">{renderCreationTime()}</div>
          </div>
        </div>
      </div>
      <img className="max-h-[450px] w-full object-contain" src={participation.image} />

      <div className="p-3">
        <div className="mb-1 text-sm font-medium text-slate-600">{formatDate(participation.date)}</div>
        <p className="font-medium break-words">{participation.description}</p>
        <div className="mt-2 text-slate-600">
          {reactionsCounters?.length > 0 && (
            <ReactionCounter
              className="space-x-0.5"
              reactions={reactionsCounters}
              showTotalOnly={true}
              iconSize={22}
              bg="transparent"
              style={{ cursor: 'default' }}
            />
          )}
        </div>
      </div>
      <div className="relative z-20 flex flex-row border-t border-slate-200 px-2 py-1">
        <button
          className="w-9 text-slate-600 hover:text-slate-500 focus:outline-none"
          onClick={() => setEmojiSelector(!emojiSelector)}
        >
          {<AddReactionOutlinedIcon color="inherit" />}
        </button>
        <div className={emojiSelector ? 'Selector_Active' : 'Selector_Idle'}>
          <ReactionBarSelector onSelect={onEmojiClick} reactions={emojis} iconSize={28} style={{ boxShadow: 'none' }} />
        </div>
      </div>
    </div>
  );
};
