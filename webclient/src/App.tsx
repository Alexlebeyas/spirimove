import { Routes, Route } from 'react-router-dom';

import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import '@/i18n/i18n';

import Header from '@/components/Header';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
