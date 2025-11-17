import Login from '@/features/auth/pages/Login';
import HomePage from '@/pages/Home';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default UserRoutes;
