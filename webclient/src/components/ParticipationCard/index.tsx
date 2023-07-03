import { ProfileImage } from '@/components';
import { IUser } from '@/interfaces';
import { DateTime } from 'luxon';

interface Props {
  description: string;
  date: string;
  dateCreated: string;
  image: string;
  user: IUser;
}

export const ParticipationCard: React.FC<Props> = ({ description, date, dateCreated, image, user }) => {
  const renderCreationTime = () => {
    const diff = DateTime.now().diff(DateTime.fromISO(dateCreated), ['day', 'hour', 'minute', 'second']).toObject();

    if (diff.days !== 0) {
      return `${diff.days}d`;
    }

    if (diff.hours !== 0) {
      return `${diff.hours}h`;
    }

    if (diff.minutes !== 0) {
      return `${diff.minutes}m`;
    }

    return `${diff.seconds?.toFixed()}s`;
  };

  return (
    <div className="mb-6 w-full overflow-hidden rounded-md bg-white shadow-md">
      <div className="p-3">
        <div className="flex items-center">
          <div className="mr-2">
            <ProfileImage name={user.display_name} image={user.profile_picture} />
          </div>
          <div>
            <div className=" text-base font-semibold">{user.display_name}</div>
            <div className="text-xs font-medium leading-[14px] text-gray-700">{renderCreationTime()}</div>
          </div>
        </div>
      </div>
      <img className="max-h-[450px] w-full object-cover" src={image} />
      <div className="bg-white p-3">
        <div className="mb-1 text-sm font-semibold">{date}</div>
        <p>{description}</p>
      </div>
    </div>
  );
};
