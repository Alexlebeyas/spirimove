import { TAILWIND_COLORS } from '@/constants';

interface Props {
  name: string;
  image?: string;
}

const getInitials = (name: string) => {
  const splitFullname = name.split(' ');
  const firstNameInitial = splitFullname[0].charAt(0);
  const lastNameInitial = splitFullname[splitFullname.length - 1].charAt(0);

  return `${firstNameInitial}${lastNameInitial}`;
};

export const ProfileImage: React.FC<Props> = ({ name, image }) => {
  const initials = getInitials(name);
  const backgroundColor = TAILWIND_COLORS[Math.floor(Math.random() * TAILWIND_COLORS.length)];

  return image ? (
    <div className="flex h-[45px] w-[45px] select-none items-center justify-center">
      <img className="h-auto w-full rounded-full" src={image} alt="" />
    </div>
  ) : (
    <div
      style={{ backgroundColor }}
      className={`flex h-[45px] w-[45px] select-none items-center justify-center rounded-full text-lg font-semibold text-white`}
    >
      {initials}
    </div>
  );
};
