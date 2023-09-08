interface Props {
  children: JSX.Element;
}
export const AppContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-lightblue pb-10 pt-24 sm:pt-28">
      <div className="min-h-[75vh]">{children}</div>
    </div>
  );
};
