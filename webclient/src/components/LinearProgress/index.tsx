interface Props {
  value: number;
  max: number;
}
export const LinearProgress: React.FC<Props> = ({ value, max }) => {
  const widthValue = (value * 100) / max;
  return (
    <div className="rounded-full bg-slate-200">
      <div style={{ width: `${widthValue}%` }} className="h-1.5 rounded-full bg-[#FFD233]"></div>
    </div>
  );
};
