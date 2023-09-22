interface Props {
  name: string;
  image?: string;
  size: number;
  fontSize: number;
}

const getInitials = (name: string) => {
  const splitFullname = name.split(' ');
  const firstName = splitFullname[0];
  const lastName = splitFullname[splitFullname.length - 1];

  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
};

export const ProfileImage: React.FC<Props> = ({ name, image, size, fontSize }) => {
  const initials = getInitials(name);
  return image ? (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className="flex select-none items-center justify-center overflow-hidden rounded-full"
    >
      <img src={image} />
    </div>
  ) : (
    <div
      style={{ width: `${size}px`, height: `${size}px`, fontSize: `${fontSize}px` }}
      className={`flex select-none items-center justify-center rounded-full bg-[#e0303b] font-semibold uppercase text-white`}
    >
      {initials}
    </div>
  );
};
