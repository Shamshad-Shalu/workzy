import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
