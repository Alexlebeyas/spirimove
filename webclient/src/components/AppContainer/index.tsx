interface Props {
  children: JSX.Element;
}
export const AppContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-slate-100 pb-10 pt-24">
      <div className="mx-auto min-h-[78vh] w-[90%] md:w-[500px]">{children}</div>
    </div>
  );
};
