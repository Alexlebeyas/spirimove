import { useState, useEffect } from 'react';

interface Props {
  name: string;
  width: number;
  height: number;
  alt?: string;
  className?: string;
}

export const Icon: React.FC<Props> = ({ name, width, height, alt, className }) => {
  const [path, setPath] = useState('');

  useEffect(() => {
    const getIcon = async () => {
      const icon = await import(`../../assets/icons/${name}.svg`);
      setPath(icon.default);
    };

    getIcon();
  }, [path, name]);

  return (
    path && (
      <img
        className={className}
        src={path}
        width={width}
        height={height}
        alt={alt ? alt : `${name} icon`}
      />
    )
  );
};
