import Login from '@/features/auth/pages/Login';
import HomePage from '@/pages/Home';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GuestRoute from './GuestRoute';

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
