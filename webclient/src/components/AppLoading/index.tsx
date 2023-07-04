import logo from '@/assets/images/logo.svg';

export const AppLoading = () => {
  return (
    <div className="absolute left-0 top-0 z-[99999] flex h-screen w-screen items-center justify-center bg-slate-800">
      <img width={250} height={250} src={logo} />
    </div>
  );
};
