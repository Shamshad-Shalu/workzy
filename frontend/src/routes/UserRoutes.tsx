import Login from '@/features/auth/pages/Login';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<h1 className="text-blue-600"> Hello</h1>} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default UserRoutes;
