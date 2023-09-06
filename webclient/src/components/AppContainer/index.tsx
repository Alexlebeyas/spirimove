interface Props {
  children: JSX.Element;
}
export const AppContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-lightergrey pb-10 pt-24">
      <div className="min-h-[75vh]">{children}</div>
    </div>
  );
};
