import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from '@/components';

import Home from '@/pages/Home';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Logout from '@/pages/Logout';
import Leaderboard from '@/pages/Leaderboard';
import Profile from '@/pages/Profile';

const Router = () => {
  return (
    <Routes>
      <Route
        path="/"
        index
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <PrivateRoute>
            <Leaderboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
