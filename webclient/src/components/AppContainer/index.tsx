interface Props {
  children: JSX.Element;
}
export const AppContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-slate-100 pt-20">
      <div className="mx-auto h-screen w-[90%] ">{children}</div>
    </div>
  );
};
